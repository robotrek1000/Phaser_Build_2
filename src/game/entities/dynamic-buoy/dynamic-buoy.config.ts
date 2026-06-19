import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type {
  DynamicBuoyGameplayState,
  DynamicBuoyVisualState,
} from './dynamic-buoy.types';
import type { AttractMotionConfig } from '@/game/motions/attract-motion';
import type { DriftMotionConfig } from '@/game/motions/drift-motion';
import type { ApplyRectHitboxConfig } from '@/game/utils';
import type { EnergyShieldRepulsionAnimationConfig } from '@/game/utils/play-energy-shield-repulsion-animation';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const DYNAMIC_BUOY_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: ASSET_KEYS.common.moneyChangeNo,
  width: 43.123,
  height: 65,
  depth: 14,
  speedYMultiplier: 0.7,
  allowGravity: false,
  immovable: false,
  alpha: 1,
  rotation: 0,
  scale: 1,
  bounce: [1.8],
};

export const DYNAMIC_BUOY_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 0.8,
  heightRatio: 0.8,
};

export const DYNAMIC_BUOY_STATES: Record<
  DynamicBuoyVisualState,
  {
    textureKey: string;
    dwellMs?: number;
  }
> = {
  up: {
    textureKey: ASSET_KEYS.common.moneyChangeUp,
    dwellMs: 1000,
  },
  down: {
    textureKey: ASSET_KEYS.common.moneyChangeDown,
    dwellMs: 1000,
  },
  no: {
    textureKey: ASSET_KEYS.common.moneyChangeNo,
  },
};

export const SWAY_CONFIG = {
  angle: 4,
  duration: 1400,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
} as const;

export const ATTRACT_MOTION_CONFIG: AttractMotionConfig = {
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

export const BLINK_CONFIG = {
  flashCount: 3,
  preHoldMs: 40,
  flashOnMs: 60,
  flashOffMs: 60,
  postHoldMs: 40,
  lockCollisionToSourceState: true,
} as const;

export const DYNAMIC_BUOY_INITIAL_STATES: DynamicBuoyGameplayState[] = [
  'up',
  'down',
];

export const DRIFT_MOTION_CONFIG: DriftMotionConfig = {
  amplitude: 50,
  maxVelocityX: 50,
  minVelocityX: 5,
};

export const ENERGY_SHIELD_REPULSION_ANIMATION_CONFIG: EnergyShieldRepulsionAnimationConfig =
  {
    distancePx: 170,
  };
