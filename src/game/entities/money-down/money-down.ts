import Phaser from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG,
  MONEY_DOWN_CONFIG,
  MONEY_DOWN_DRIFT_MOTION_CONFIG,
  MONEY_DOWN_HITBOX_CONFIG,
  MONEY_DOWN_SWAY_CONFIG,
} from './money-down.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { DriftMotion } from '@/game/motions/drift-motion';
import { GameState } from '@/game/system/game-state';
import {
  applyRectHitbox,
  playBuoyImpactAnimation,
  playEnergyShieldRepulsionAnimation,
} from '@/game/utils';

export class MoneyDown extends BaseSpawnedObject {
  protected config = MONEY_DOWN_CONFIG;

  protected energyShieldRepulsionAnimationConfig =
    ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG;

  protected isEnergyShieldRepulsionAnimationActive = false;

  protected swayTween?: Phaser.Tweens.Tween;

  protected driftMotion?: DriftMotion;

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    if (this.isEnergyShieldRepulsionAnimationActive) {
      return;
    }

    this.driftMotion?.update();
  }

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    this.driftMotion = new DriftMotion(this, MONEY_DOWN_DRIFT_MOTION_CONFIG);

    applyRectHitbox(this, MONEY_DOWN_HITBOX_CONFIG);

    this.startSway();
    this.driftMotion.start();
  }

  override async handleEnergyShieldCollision(
    energyShield: Phaser.GameObjects.Graphics
  ) {
    if (this.isEnergyShieldRepulsionAnimationActive) {
      return;
    }

    this.isEnergyShieldRepulsionAnimationActive = true;

    this.driftMotion?.stop();

    await playEnergyShieldRepulsionAnimation({
      object: this,
      energyShield,
      config: this.energyShieldRepulsionAnimationConfig,
    });

    this.isEnergyShieldRepulsionAnimationActive = false;

    this.driftMotion?.start();
  }

  protected startSway() {
    const { angle, ...swayTweenConfig } = MONEY_DOWN_SWAY_CONFIG;

    this.swayTween = this.scene.tweens.add({
      targets: this,
      angle: { from: -angle, to: angle },
      ...swayTweenConfig,
    });
  }

  protected stopSway() {
    this.swayTween?.stop();
    this.swayTween = undefined;
  }

  protected override async playDespawnAnimation(): Promise<void> {
    this.stopSway();
    this.driftMotion?.stop();

    await playBuoyImpactAnimation(this);
  }
}
