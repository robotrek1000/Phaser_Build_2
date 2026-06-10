import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { DriftMotionConfig } from '@/game/motions/drift-motion';
import type { ApplyRectHitboxConfig } from '@/game/utils';
import type { EnergyShieldRepulsionAnimationConfig } from '@/game/utils/play-energy-shield-repulsion-animation';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const MONEY_DOWN_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: NEW_ASSET_KEYS.common.moneyDown,
  width: 43.123,
  height: 65,
  depth: 14,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: false,
  alpha: 1,
  rotation: 0,
  scale: 1,
  bounce: [1.8],
};

export const MONEY_DOWN_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 0.8,
  heightRatio: 0.8,
};

export const MONEY_DOWN_SWAY_CONFIG = {
  angle: 4,
  duration: 1400,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
} as const;

export const MONEY_DOWN_DRIFT_MOTION_CONFIG: DriftMotionConfig = {
  amplitude: 270,
  maxVelocityX: 190,
  minVelocityX: 24,
};

export const ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG: EnergyShieldRepulsionAnimationConfig =
  {
    distancePx: 500,
  };
