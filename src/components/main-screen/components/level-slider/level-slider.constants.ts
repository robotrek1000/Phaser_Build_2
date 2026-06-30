import type { LevelConfig } from './level-slider.types';
import type { ClientLevelNumber } from '@/shared/types';

import lvl1Bg from '@/assets/lvl_background_1.webp';
import lvl2Bg from '@/assets/lvl_background_2.webp';
import lvl3Bg from '@/assets/lvl_background_3.webp';

export const LEVELS_CONFIG: Record<ClientLevelNumber, LevelConfig> = {
  1: {
    bg: lvl1Bg,
  },
  2: {
    bg: lvl2Bg,
  },
  3: {
    bg: lvl3Bg,
  },
};
