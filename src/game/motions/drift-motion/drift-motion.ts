import * as Phaser from 'phaser';

import { BaseMotion } from '../base-motion';

import type { Direction, DriftMotionConfig } from './drift-motion.types';

export class DriftMotion extends BaseMotion {
  private config: DriftMotionConfig;
  private initialX: number;
  private direction: Direction = 1;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, config: DriftMotionConfig) {
    super(sprite);

    this.config = config;
    this.initialX = this.sprite.x;
  }

  start() {
    if (this.isEnabled) {
      return;
    }

    super.start();

    this.initialX = this.sprite.x;

    this.direction = Phaser.Utils.Array.GetRandom<Direction>([1, -1]);

    this.applyPendulumVelocity();
  }

  update() {
    if (!this.isEnabled || !this.sprite.active || !this.sprite.body) {
      return;
    }

    const halfAmplitude = this.config.amplitude / 2;

    const left = this.initialX - halfAmplitude;
    const right = this.initialX + halfAmplitude;

    if (this.sprite.x >= right) {
      this.sprite.x = right;
      this.direction = -1;
    }

    if (this.sprite.x <= left) {
      this.sprite.x = left;
      this.direction = 1;
    }

    this.applyPendulumVelocity();
  }

  private applyPendulumVelocity() {
    const halfAmplitude = this.config.amplitude / 2;

    if (halfAmplitude <= 0) {
      this.sprite.setVelocityX(0);
      return;
    }

    const distanceFromCenter = Math.abs(this.sprite.x - this.initialX);
    const normalizedDistance = Phaser.Math.Clamp(
      distanceFromCenter / halfAmplitude,
      0,
      1
    );
    const pendulumFactor = Math.sqrt(1 - normalizedDistance ** 2);
    const speed = Phaser.Math.Linear(
      this.config.minVelocityX,
      this.config.maxVelocityX,
      pendulumFactor
    );

    this.sprite.setVelocityX(this.direction * speed);
  }
}
