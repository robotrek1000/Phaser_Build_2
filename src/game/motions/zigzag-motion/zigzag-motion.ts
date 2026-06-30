import { Utils } from 'phaser';

import { BaseMotion } from '../base-motion';

import type { Direction, ZigzagMotionConfig } from './zigzag-motion.types';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';

export class ZigzagMotion extends BaseMotion {
  private config: ZigzagMotionConfig;

  constructor(sprite: BaseSpawnedObject, config: ZigzagMotionConfig) {
    super(sprite);

    this.config = config;
  }

  start() {
    if (this.isEnabled) {
      return;
    }

    super.start();

    this.push(Utils.Array.GetRandom<Direction>([1, -1]));
  }

  update() {
    if (
      !this.isEnabled ||
      !this.sprite.active ||
      this.sprite.isMarkedToDelete
    ) {
      return;
    }

    const { width } = this.sprite.scene.scale;
    const spriteBounds = this.sprite.getBounds();

    if (
      spriteBounds.x + spriteBounds.width >=
      width - width * this.config.rightPaddingRatio
    ) {
      this.push(-1);
    }

    if (spriteBounds.x <= width * this.config.leftPaddingRatio) {
      this.push();
    }
  }

  private push(direction: Direction = 1) {
    this.sprite.setVelocityX(direction * this.config.velocityX);
  }
}
