import * as Phaser from 'phaser';

import { BaseMotion } from '../base-motion';

import type { BobMotionConfig } from './bob-motion.types';

import { scaled } from '@/game/utils';

export class BobMotion extends BaseMotion {
  private config: BobMotionConfig;

  private phase: number;

  private prevYOffset = 0;

  get yOffset() {
    return this.prevYOffset;
  }

  get yOffsetRatio() {
    return this.prevYOffset / scaled(this.config.amplitude);
  }

  constructor(sprite: Phaser.Physics.Arcade.Sprite, config: BobMotionConfig) {
    super(sprite);

    this.config = config;
    this.phase = Phaser.Math.FloatBetween(0, Math.PI * 2);
  }

  update() {
    if (!this.isEnabled || !this.sprite.active) {
      return;
    }

    const timeSec = this.sprite.scene.time.now / 1000;
    const nextOffset =
      Math.sin(timeSec * this.config.frequency * 2 * Math.PI + this.phase) *
      scaled(this.config.amplitude);

    this.sprite.y += nextOffset - this.prevYOffset;
    this.prevYOffset = nextOffset;
  }
}
