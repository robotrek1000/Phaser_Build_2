import type { BaseSpawnedObjectConfig } from '../base-spawned-object';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const HARBOR_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: {
    1: ASSET_KEYS.level1.harbor,
    2: ASSET_KEYS.level2.harbor,
    3: ASSET_KEYS.level3.harbor,
  },
  width: 360,
  height: 477,
  depth: 15,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const HARBOR_PARTIAL_SPAWN_MAX_OFFSET_PX = 120;

export const HARBOR_BODY_Y_OFFSET_PX = 200;
