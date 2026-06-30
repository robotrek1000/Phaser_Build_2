import { Math as PhaserMath } from 'phaser';

import { BaseMotion } from '../base-motion';

import type { BobMotionConfig } from './bob-motion.types';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';
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

  constructor(sprite: BaseSpawnedObject, config: BobMotionConfig) {
    super(sprite);

    this.config = config;
    this.phase = PhaserMath.FloatBetween(0, Math.PI * 2);
  }

  update() {
    if (
      !this.isEnabled ||
      !this.sprite.active ||
      this.sprite.isMarkedToDelete
    ) {
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
