import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { AttractMotionConfig } from '@/game/motions/attract-motion';
import type { ApplyRectHitboxConfig } from '@/game/utils';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const MONEY_UP_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: NEW_ASSET_KEYS.common.moneyUp,
  width: 43.123,
  height: 65,
  depth: 13,
  speedYMultiplier: 0.8,
  allowGravity: false,
  immovable: false,
  alpha: 1,
  rotation: 0,
  scale: 1,
  bounce: [2],
  damping: true,
  drag: 0.1,
};

export const MONEY_UP_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 0.8,
  heightRatio: 0.8,
};

export const MONEY_UP_SWAY_CONFIG = {
  angle: 4,
  duration: 1400,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
} as const;

export const MONEY_UP_ATTRACT_MOTION_CONFIG: AttractMotionConfig = {
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
