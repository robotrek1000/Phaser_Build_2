import * as Phaser from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  MONEY_UP_ATTRACT_MOTION_CONFIG,
  MONEY_UP_CONFIG,
  MONEY_UP_HITBOX_CONFIG,
  MONEY_UP_SWAY_CONFIG,
} from './money-up.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { AttractMotion } from '@/game/motions/attract-motion';
import { GameState } from '@/game/system/game-state';
import {
  applyRectHitbox,
  playCollectBuoyAnimation,
  scaled,
} from '@/game/utils';

export class MoneyUp extends BaseSpawnedObject {
  protected config = MONEY_UP_CONFIG;

  protected attractMotion?: AttractMotion;

  protected swayTween?: Phaser.Tweens.Tween;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRectHitbox(this, MONEY_UP_HITBOX_CONFIG);

    this.attractMotion = new AttractMotion({
      sprite: this,
      targetObject: this.player,
      config: MONEY_UP_ATTRACT_MOTION_CONFIG,
    });

    this.startSway();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    const isAffectedByEnergyShield =
      this.gameState?.hasEnergyShield &&
      this.attractMotion?.isInsideMagnetRadius;

    if (isAffectedByEnergyShield && !this.attractMotion?.isActive) {
      this.attractMotion?.start();
    }

    if (!isAffectedByEnergyShield && this.attractMotion?.isActive) {
      this.attractMotion?.stop();
      this.setVelocityX(0);
    }

    if (this.attractMotion?.isActive) {
      this.attractMotion.update(
        this.baseFallSpeedByKmh * this.config.speedYMultiplier
      );
    }
  }

  protected startSway() {
    const { angle, ...swayTweenConfig } = MONEY_UP_SWAY_CONFIG;

    this.swayTween = this.scene.tweens.add({
      targets: this,
      angle: { from: -scaled(angle), to: scaled(angle) },
      ...swayTweenConfig,
    });
  }

  protected stopSway() {
    this.swayTween?.stop();
    this.swayTween = undefined;
  }

  protected override async playDespawnAnimation(): Promise<void> {
    this.stopSway();

    await playCollectBuoyAnimation(this.player, this);
  }
}
