import type { WaterBackgroundLevelConfig } from './water-background.types';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const WATER_BACKGROUND_DEPTH = 0;

export const WATER_BACKGROUND_LEVEL_CONFIG: WaterBackgroundLevelConfig = {
  1: NEW_ASSET_KEYS.level1.waterBackground,
  2: NEW_ASSET_KEYS.level2.waterBackground,
  3: NEW_ASSET_KEYS.level3.waterBackground,
};
