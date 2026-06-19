import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { ApplyRectHitboxConfig } from '@/game/utils';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const REEF_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: {
    1: ASSET_KEYS.level1.solidObstacle,
    2: ASSET_KEYS.level2.solidObstacle,
    3: ASSET_KEYS.level3.solidObstacle,
  },
  width: {
    1: 124,
    2: 118,
    3: 134,
  },
  height: {
    1: 110.922,
    2: 112,
    3: 63,
  },
  depth: 13,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const REEF_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 1,
  heightRatio: 1,
};

export const REEF_PARTIAL_SPAWN_MAX_OFFSET_PX = 120;
