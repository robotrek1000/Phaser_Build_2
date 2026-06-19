import type { WaterBackgroundLevelConfig } from './water-background.types';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const WATER_BACKGROUND_DEPTH = 0;

export const WATER_BACKGROUND_LEVEL_CONFIG: WaterBackgroundLevelConfig = {
  1: ASSET_KEYS.level1.waterBackground,
  2: ASSET_KEYS.level2.waterBackground,
  3: ASSET_KEYS.level3.waterBackground,
};
