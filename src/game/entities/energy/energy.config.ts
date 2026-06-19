import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { AttractMotionConfig } from '@/game/motions/attract-motion';
import type { BobMotionConfig } from '@/game/motions/bob-motion';
import type {
  ApplyRectHitboxConfig,
  FollowShadowScaleMotionConfig,
} from '@/game/utils';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const ENERGY_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: ASSET_KEYS.common.energy,
  width: 28.377,
  height: 47,
  depth: 20,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const ENERGY_SHADOW_CONFIG = {
  textureKey: ASSET_KEYS.shadows.energy,
  width: 74,
  height: 24,
  depth: 8,
} as const;

export const ENERGY_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 1,
  heightRatio: 1,
};

export const ENERGY_SHADOW_MOTION_CONFIG: FollowShadowScaleMotionConfig = {
  yOffset: 50,
  minScale: 0.5,
  maxScale: 0.8,
};

export const ENERGY_ATTRACT_MOTION_CONFIG: AttractMotionConfig = {
  radius: 350,
  forcePxPerSec: 300,
  falloffPower: 0.5,
  maxPullSpeedXPxPerSec: 360,
  maxPullSpeedYPxPerSec: 260,
  minDistancePx: 12,
  axisFactorX: 1.15,
  axisFactorY: 0.82,
  tangentialDamping: 0.9,
  disableMagnetViewportBottomPaddingPx: 0,
};

export const ENERGY_BOB_MOTION_CONFIG: BobMotionConfig = {
  amplitude: 12,
  frequency: 0.76,
};
