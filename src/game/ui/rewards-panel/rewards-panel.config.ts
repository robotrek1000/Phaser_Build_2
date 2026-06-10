import type { VisibleRewardBonus } from './rewards-panel.types';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const PANEL_DEPTH = 58;

export const ROW_Y = 102;

export const ICON_SIZE = 36;

export const GAP = 5;

export const LAYOUTS: Record<1 | 2 | 3, number[]> = {
  1: [0],
  2: [-21, 21],
  3: [-41, 0, 41],
};

export const BONUS_ICON_KEYS: Record<VisibleRewardBonus, string> = {
  assets: ASSET_KEYS.ui.skillWheelSector_1,
  time: ASSET_KEYS.bonuses.timeBonus,
  energy: ASSET_KEYS.bonuses.energy,
};
