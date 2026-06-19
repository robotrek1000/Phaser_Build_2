import type { LevelConfig } from '@/components/main-screen/components/level-slider/level-slider.types';
import type { ClientLevelNumber } from '@/shared/types';
import type {
  MotionNodeAnimationOptions,
  MotionNodeDraggableOptions,
} from 'motion-dom';

import lvl1Bg from '@/assets/lvl-1-bg.png';
import lvl2Bg from '@/assets/lvl-2-bg.png';
import lvl3Bg from '@/assets/lvl-3-bg.png';

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

export const IMG_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 },
};

export const TEXT_ART_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0 },
};

export const SLIDE_DRAG_CONFIG: MotionNodeDraggableOptions = {
  drag: 'x',
  dragConstraints: { left: 0, right: 0 },
  dragElastic: 0.01,
};
