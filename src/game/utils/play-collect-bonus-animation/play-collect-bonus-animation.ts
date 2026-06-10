import Phaser from 'phaser';

import { tweenToPromise } from '@/game/utils';
import { COLLECT_BONUS_ANIMATION_CONFIG } from '@/game/utils/play-collect-bonus-animation/play-collect-bonus-animation.config';

export const playCollectBonusAnimation = async (
  sprite: Phaser.Physics.Arcade.Sprite
) => {
  const {
    duration,
    ease,
    arcOffsetXMin,
    arcOffsetXMax,
    arcOffsetYMin,
    arcOffsetYMax,
    spriteScaleEnd,
    spriteAlphaEnd,
  } = COLLECT_BONUS_ANIMATION_CONFIG;

  return tweenToPromise(sprite.scene, {
    targets: sprite,
    x: sprite.x + Phaser.Math.FloatBetween(arcOffsetXMin, arcOffsetXMax),
    y: sprite.y + Phaser.Math.FloatBetween(arcOffsetYMin, arcOffsetYMax),
    scaleX: spriteScaleEnd,
    scaleY: spriteScaleEnd,
    alpha: spriteAlphaEnd,
    duration,
    ease,
  });
};
