import type { BaseSpawnedObjectConfig } from '../base-spawned-object';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const WHEEL_ISLAND_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: {
    1: NEW_ASSET_KEYS.level1.island,
    2: NEW_ASSET_KEYS.level2.island,
    3: NEW_ASSET_KEYS.level3.island,
  },
  width: 334,
  height: 255,
  depth: 15,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const DESPAWN_ANIMATION_CONFIG = {
  alpha: 0,
  duration: 600,
  ease: 'Sine.easeInOut',
} as const;

export const WHEEL_ISLAND_SPAWN_MAX_OFFSET_PX = 120;

export const WHEEL_ISLAND_BODY_Y_OFFSET_PX = 163;
