import { GameObjects } from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  TIME_BONUS_BOB_MOTION_CONFIG,
  TIME_BONUS_CONFIG,
  TIME_BONUS_HITBOX_CONFIG,
  TIME_BONUS_SHADOW_CONFIG,
  TIME_BONUS_SHADOW_MOTION_CONFIG,
  TIME_BONUS_ZIGZAG_MOTION_CONFIG,
} from './time-bonus.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { BobMotion } from '@/game/motions/bob-motion';
import { ZigzagMotion } from '@/game/motions/zigzag-motion';
import { GameState } from '@/game/system/game-state';
import {
  applyRoundHitbox,
  followShadowScaleMotion,
  playCollectBonusAnimation,
  scaled,
} from '@/game/utils';

export class TimeBonus extends BaseSpawnedObject {
  protected config = TIME_BONUS_CONFIG;

  private shadow?: GameObjects.Image;

  private zigzagMotion?: ZigzagMotion;

  private bobMotion?: BobMotion;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRoundHitbox(this, TIME_BONUS_HITBOX_CONFIG);

    this.clearShadow();

    this.shadow = this.scene.add
      .image(
        this.x,
        this.y + scaled(TIME_BONUS_SHADOW_MOTION_CONFIG.yOffset),
        TIME_BONUS_SHADOW_CONFIG.textureKey
      )
      .setDisplaySize(
        TIME_BONUS_SHADOW_CONFIG.width,
        TIME_BONUS_SHADOW_CONFIG.height
      )
      .setDepth(TIME_BONUS_SHADOW_CONFIG.depth);

    this.zigzagMotion = new ZigzagMotion(this, TIME_BONUS_ZIGZAG_MOTION_CONFIG);
    this.bobMotion = new BobMotion(this, TIME_BONUS_BOB_MOTION_CONFIG);

    this.zigzagMotion.start();
    this.bobMotion.start();
    this.syncShadowMotion();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.active || this.isMarkedToDelete) {
      return;
    }

    this.zigzagMotion?.update();
    this.bobMotion?.update();
    this.syncShadowMotion();
  }

  async despawn() {
    this.zigzagMotion?.stop();
    this.bobMotion?.stop();
    this.clearShadow();

    return super.despawn();
  }

  protected override async playDespawnAnimation() {
    await playCollectBonusAnimation(this);
  }

  private clearShadow() {
    this.shadow?.setVisible(false);
    this.shadow?.destroy();

    this.shadow = undefined;
  }

  private syncShadowMotion() {
    if (!this.shadow) {
      return;
    }

    followShadowScaleMotion({
      target: this,
      shadow: this.shadow,
      config: TIME_BONUS_SHADOW_MOTION_CONFIG,
      targetYOffset: this.bobMotion?.yOffset,
      targetYOffsetRatio: this.bobMotion?.yOffsetRatio,
    });
  }
}
