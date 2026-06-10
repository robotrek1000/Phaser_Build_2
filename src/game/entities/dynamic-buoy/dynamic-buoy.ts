import * as Phaser from 'phaser';

import { BaseSpawnedObject, SPAWN_OBJECT_DATA } from '../base-spawned-object';

import {
  ATTRACT_MOTION_CONFIG,
  BLINK_CONFIG,
  DRIFT_MOTION_CONFIG,
  DYNAMIC_BUOY_CONFIG,
  DYNAMIC_BUOY_HITBOX_CONFIG,
  DYNAMIC_BUOY_INITIAL_STATES,
  DYNAMIC_BUOY_STATES,
  ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG,
  SWAY_CONFIG,
} from './dynamic-buoy.config';

import type {
  DynamicBuoyGameplayState,
  DynamicBuoyVisualState,
} from './dynamic-buoy.types';
import type { SpawnObjectConfig } from '@/game/level-design';

import { AttractMotion } from '@/game/motions/attract-motion';
import { DriftMotion } from '@/game/motions/drift-motion';
import { GameState } from '@/game/system/game-state';
import {
  applyRectHitbox,
  playBuoyImpactAnimation,
  playCollectBuoyAnimation,
  playEnergyShieldRepulsionAnimation,
} from '@/game/utils';

export class DynamicBuoy extends BaseSpawnedObject {
  protected config = DYNAMIC_BUOY_CONFIG;

  protected driftMotion?: DriftMotion;
  private attractMotion?: AttractMotion;

  private swayTween?: Phaser.Tweens.Tween;
  private stateTimer?: Phaser.Time.TimerEvent;
  private isEnergyShieldRepulsionAnimationActive = false;

  private gameplayState: DynamicBuoyGameplayState = 'up';
  private visualState: DynamicBuoyVisualState = 'up';
  private blinkSourceState: DynamicBuoyGameplayState = 'up';

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRectHitbox(this, DYNAMIC_BUOY_HITBOX_CONFIG);

    this.setVelocityY(this.baseFallSpeedByKmh * this.config.speedYMultiplier);

    this.driftMotion = new DriftMotion(this, DRIFT_MOTION_CONFIG);

    this.attractMotion = new AttractMotion({
      sprite: this,
      targetObject: this.player,
      config: ATTRACT_MOTION_CONFIG,
    });

    this.gameplayState = Phaser.Utils.Array.GetRandom(
      DYNAMIC_BUOY_INITIAL_STATES
    );
    this.blinkSourceState = this.gameplayState;

    this.applyVisualState(this.gameplayState);
    this.startSway();
    this.driftMotion.start();
    this.scheduleDwell();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    if (this.isEnergyShieldRepulsionAnimationActive) {
      return;
    }

    const isAffectedByEnergyShield =
      this.visualState === 'up' &&
      this.gameState?.hasEnergyShield &&
      this.attractMotion?.isInsideMagnetRadius;

    if (isAffectedByEnergyShield && !this.attractMotion?.isActive) {
      this.driftMotion?.stop();
      this.attractMotion?.start();
    }

    if (!isAffectedByEnergyShield && this.attractMotion?.isActive) {
      this.attractMotion?.stop();
      this.setVelocityX(0);
      this.driftMotion?.start();
    }

    if (this.attractMotion?.isActive) {
      this.attractMotion.update(
        this.baseFallSpeedByKmh * this.config.speedYMultiplier
      );
    }

    this.driftMotion?.update();
  }

  override async handleEnergyShieldCollision(
    energyShield: Phaser.GameObjects.Graphics
  ) {
    if (this.isEnergyShieldRepulsionAnimationActive) {
      return;
    }

    this.isEnergyShieldRepulsionAnimationActive = true;

    this.driftMotion?.stop();
    this.attractMotion?.stop();

    await playEnergyShieldRepulsionAnimation({
      object: this,
      energyShield,
      config: ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG,
    });

    this.isEnergyShieldRepulsionAnimationActive = false;

    this.driftMotion?.start();
  }

  protected override async playDespawnAnimation(): Promise<void> {
    this.driftMotion?.stop();
    this.attractMotion?.stop();
    this.stopSway();
    this.clearStateTimer();

    if (this.gameplayState === 'up') {
      await playCollectBuoyAnimation(this.player, this);
    }

    if (this.gameplayState === 'down') {
      await playBuoyImpactAnimation(this);
    }
  }

  private startSway() {
    const { angle, ...swayTweenConfig } = SWAY_CONFIG;

    this.swayTween = this.scene.tweens.add({
      targets: this,
      angle: { from: -angle, to: angle },
      ...swayTweenConfig,
    });
  }

  private stopSway() {
    this.swayTween?.stop();
    this.swayTween = undefined;
  }

  private applyVisualState(state: DynamicBuoyVisualState) {
    this.visualState = state;

    this.setTexture(DYNAMIC_BUOY_STATES[state].textureKey).setData(
      SPAWN_OBJECT_DATA.SUBTYPE,
      this.visualState
    );

    applyRectHitbox(this, DYNAMIC_BUOY_HITBOX_CONFIG);
  }

  private scheduleDwell() {
    const dwellMs = DYNAMIC_BUOY_STATES[this.gameplayState].dwellMs ?? 1000;

    this.clearStateTimer();
    this.stateTimer = this.scene.time.delayedCall(dwellMs, () => {
      this.startBlinkCycle();
    });
  }

  private startBlinkCycle() {
    this.blinkSourceState = this.gameplayState;

    const targetState: DynamicBuoyGameplayState =
      this.gameplayState === 'up' ? 'down' : 'up';

    let flashesLeft = BLINK_CONFIG.flashCount;

    const showNo = () => {
      if (!this.active) {
        return;
      }

      this.applyVisualState('no');

      this.stateTimer = this.scene.time.delayedCall(
        BLINK_CONFIG.flashOffMs,
        showSource
      );
    };

    const showSource = () => {
      if (!this.active) {
        return;
      }

      this.applyVisualState(this.blinkSourceState);
      flashesLeft -= 1;

      if (flashesLeft <= 0) {
        this.stateTimer = this.scene.time.delayedCall(
          BLINK_CONFIG.postHoldMs,
          finalize
        );
        return;
      }

      this.stateTimer = this.scene.time.delayedCall(
        BLINK_CONFIG.flashOnMs,
        showNo
      );
    };

    const finalize = () => {
      if (!this.active) return;

      this.gameplayState = targetState;
      this.blinkSourceState = targetState;
      this.applyVisualState(targetState);
      this.scheduleDwell();
    };

    this.clearStateTimer();
    this.stateTimer = this.scene.time.delayedCall(
      BLINK_CONFIG.preHoldMs,
      showNo
    );
  }

  private clearStateTimer() {
    this.stateTimer?.remove(false);
    this.stateTimer = undefined;
  }
}
