import * as Phaser from 'phaser';

import { type FollowShadowScaleMotionArgs, scaled } from '@/game/utils';

export const followShadowScaleMotion = ({
  target,
  shadow,
  config,
  targetYOffset = 0,
  targetYOffsetRatio = 1,
}: FollowShadowScaleMotionArgs) => {
  if (!shadow?.visible || !target.active || !target.visible) {
    return;
  }

  const scale = Phaser.Math.Linear(
    config.minScale,
    config.maxScale,
    (1 + targetYOffsetRatio) / 2
  );

  shadow
    .setPosition(target.x, target.y - targetYOffset + scaled(config.yOffset))
    .setScale(scale, scale);
};
