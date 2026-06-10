import * as Phaser from 'phaser';

export interface AttractMotionConfig {
  radius: number;
  forcePxPerSec: number;
  falloffPower: number;
  maxPullSpeedXPxPerSec: number;
  maxPullSpeedYPxPerSec: number;
  minDistancePx: number;
  axisFactorX: number;
  axisFactorY: number;
  tangentialDamping: number;
  disableMagnetViewportBottomPaddingPx: number;
}

export interface AttractMotionConstructorArgs {
  sprite: Phaser.Physics.Arcade.Sprite;
  targetObject: Phaser.GameObjects.GameObject;
  config: AttractMotionConfig;
}
