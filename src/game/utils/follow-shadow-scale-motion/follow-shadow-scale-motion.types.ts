import { GameObjects, Physics } from 'phaser';

export interface FollowShadowScaleMotionConfig {
  yOffset: number;
  minScale: number;
  maxScale: number;
}

export interface FollowShadowScaleMotionArgs {
  target: Physics.Arcade.Sprite;
  shadow?: GameObjects.Image | GameObjects.Ellipse | GameObjects.Container;
  config: FollowShadowScaleMotionConfig;
  targetYOffset?: number;
  targetYOffsetRatio?: number;
}
