import { GameObjects } from 'phaser';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';

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
  sprite: BaseSpawnedObject;
  targetObject: GameObjects.GameObject;
  config: AttractMotionConfig;
}
