import { GameObjects } from 'phaser';

import { MoneyDown } from '../money-down';

import { MONEY_DOWN_MAGNET_ATTRACT_MOTION_CONFIG } from './money-down-magnet.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { AttractMotion } from '@/game/motions/attract-motion';
import { GameState } from '@/game/system/game-state';
import { playEnergyShieldRepulsionAnimation } from '@/game/utils';

export class MoneyDownMagnet extends MoneyDown {
  protected attractMotion?: AttractMotion;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    this.attractMotion = new AttractMotion({
      sprite: this,
      targetObject: this.player,
      config: MONEY_DOWN_MAGNET_ATTRACT_MOTION_CONFIG,
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active || this.isMarkedToDelete) {
      return;
    }

    if (this.isEnergyShieldRepulsionAnimationActive) {
      return;
    }

    if (this.attractMotion?.isInsideMagnetRadius) {
      this.driftMotion?.stop();
      this.attractMotion.start();
      this.attractMotion.update(
        this.worldFallSpeedPxPerSec * this.config.speedYMultiplier
      );
    } else {
      this.attractMotion?.stop();
      this.driftMotion?.start();
    }
  }

  override async handleEnergyShieldCollision(
    energyShield: GameObjects.Graphics
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
      config: this.energyShieldRepulsionAnimationConfig,
    });

    this.isEnergyShieldRepulsionAnimationActive = false;

    this.driftMotion?.start();
  }
}
