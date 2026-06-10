import { tweenToPromise } from '../tween-to-promise';

import { ENERGY_SHIELD_REPULSION_TWEEN_CONFIG } from './play-energy-shield-repulsion-animation.config';

import type { PlayEnergyShieldRepulsionAnimationArgs } from './play-energy-shield-repulsion-animation.types';
import type * as Phaser from 'phaser';

import { scaled } from '@/game/utils';

export const playEnergyShieldRepulsionAnimation = async ({
  object,
  energyShield,
  config,
}: PlayEnergyShieldRepulsionAnimationArgs) => {
  const objectBody = object.body as Phaser.Physics.Arcade.Body | undefined;
  const shieldBody = energyShield.body as
    | Phaser.Physics.Arcade.Body
    | undefined;

  if (!objectBody || !shieldBody) {
    return;
  }

  const dx = objectBody.center.x - shieldBody.center.x;
  const dy = objectBody.center.y - shieldBody.center.y;
  const l = Math.hypot(dx, dy);

  const targetCenterX =
    shieldBody.center.x + (dx / l) * scaled(config.distancePx);
  const targetCenterY =
    shieldBody.center.y + (dy / l) * scaled(config.distancePx);

  const targetX = targetCenterX - object.displayWidth * object.originX;
  const targetY = targetCenterY - object.displayHeight * object.originY;

  objectBody.setVelocity(0, 0);

  await tweenToPromise(object.scene, {
    targets: object,
    x: targetX,
    y: targetY,
    ...ENERGY_SHIELD_REPULSION_TWEEN_CONFIG,
  });
};
