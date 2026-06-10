import * as Phaser from 'phaser';

export interface FollowShadowScaleMotionConfig {
  yOffset: number;
  minScale: number;
  maxScale: number;
}

export interface FollowShadowScaleMotionArgs {
  target: Phaser.Physics.Arcade.Sprite;
  shadow?:
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Ellipse
    | Phaser.GameObjects.Container;
  config: FollowShadowScaleMotionConfig;
  targetYOffset?: number;
  targetYOffsetRatio?: number;
}
