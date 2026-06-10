import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { BobMotionConfig } from '@/game/motions/bob-motion';
import type { ZigzagMotionConfig } from '@/game/motions/zigzag-motion';
import type { FollowShadowScaleMotionConfig } from '@/game/utils';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const TIME_BONUS_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: NEW_ASSET_KEYS.common.timeBonus,
  width: 48,
  height: 47,
  depth: 20,
  speedYMultiplier: 1.35,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const TIME_BONUS_SHADOW_CONFIG = {
  textureKey: NEW_ASSET_KEYS.shadows.timeBonus,
  width: 74,
  height: 24,
  depth: 8,
} as const;

export const TIME_BONUS_HITBOX_CONFIG: number = 0.7;

export const TIME_BONUS_SHADOW_MOTION_CONFIG: FollowShadowScaleMotionConfig = {
  yOffset: 70,
  minScale: 0.5,
  maxScale: 0.8,
};

export const TIME_BONUS_ZIGZAG_MOTION_CONFIG: ZigzagMotionConfig = {
  velocityX: 500,
  leftPaddingRatio: 0.03,
  rightPaddingRatio: 0.03,
};

export const TIME_BONUS_BOB_MOTION_CONFIG: BobMotionConfig = {
  amplitude: 15,
  frequency: 0.65,
};
