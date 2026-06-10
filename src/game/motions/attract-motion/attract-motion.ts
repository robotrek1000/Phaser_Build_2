import * as Phaser from 'phaser';

import { BaseMotion } from '../base-motion';

import type {
  AttractMotionConfig,
  AttractMotionConstructorArgs,
} from './attract-motion.types';

import { scaled } from '@/game/utils';

export class AttractMotion extends BaseMotion {
  private config: AttractMotionConfig;

  private targetObject: Phaser.GameObjects.GameObject;

  private get attractedObjectBody() {
    return this.sprite.body as Phaser.Physics.Arcade.Body;
  }

  private get targetObjectBody() {
    return this.targetObject.body as Phaser.Physics.Arcade.Body;
  }

  private get dx() {
    return this.attractedObjectBody.center.x - this.targetObjectBody.center.x;
  }

  private get dy() {
    return this.attractedObjectBody.center.y - this.targetObjectBody.center.y;
  }

  private get distance() {
    return Math.hypot(this.dx, this.dy);
  }

  get isInsideMagnetRadius() {
    const viewportBottomStopY =
      this.sprite.scene.scale.height -
      scaled(this.config.disableMagnetViewportBottomPaddingPx);

    const isTooLowForMagnet =
      this.attractedObjectBody.center.y >= viewportBottomStopY;

    const distance = this.distance;

    return (
      !isTooLowForMagnet &&
      distance > scaled(this.config.minDistancePx) &&
      distance <= scaled(this.config.radius)
    );
  }

  constructor({ sprite, targetObject, config }: AttractMotionConstructorArgs) {
    super(sprite);

    this.targetObject = targetObject;
    this.config = config;
  }

  update(baseVelocityY: number) {
    if (!this.isEnabled || !this.sprite.active) {
      return;
    }

    const dx = this.dx;
    const dy = this.dy;
    const distance = this.distance;

    const normalizedDistance = Phaser.Math.Clamp(
      distance / this.config.radius,
      0,
      1
    );
    const falloff = Math.pow(
      Math.max(0, 1 - normalizedDistance),
      Math.max(0.05, this.config.falloffPower)
    );

    const desiredPullX = Phaser.Math.Clamp(
      (-dx / distance) *
        this.config.forcePxPerSec *
        falloff *
        this.config.axisFactorX,
      -this.config.maxPullSpeedXPxPerSec,
      this.config.maxPullSpeedXPxPerSec
    );

    const desiredPullY = Phaser.Math.Clamp(
      (-dy / distance) *
        this.config.forcePxPerSec *
        falloff *
        this.config.axisFactorY,
      -this.config.maxPullSpeedYPxPerSec,
      this.config.maxPullSpeedYPxPerSec
    );

    const radialNx = -dx / distance;

    const radialNy = -dy / distance;

    const desiredVx = desiredPullX;

    const desiredVy = baseVelocityY + desiredPullY;

    const radialSpeed = desiredVx * radialNx + desiredVy * radialNy;

    const tangentialVx = desiredVx - radialSpeed * radialNx;

    const tangentialVy = desiredVy - radialSpeed * radialNy;

    const correctedVx =
      desiredVx - tangentialVx * this.config.tangentialDamping;

    const correctedVy =
      desiredVy - tangentialVy * this.config.tangentialDamping;

    this.sprite.setVelocity(correctedVx, correctedVy);
  }
}
