import type { LevelConfig } from '@/components/main-screen/components/level-slider/level-slider.types';
import type { LevelId } from '@/game/level-design';
import type {
  MotionNodeAnimationOptions,
  MotionNodeDraggableOptions,
} from 'motion-dom';

import lvl1Bg from '@/assets/lvl-1-bg.png';
import lvl2Bg from '@/assets/lvl-2-bg.png';
import lvl3Bg from '@/assets/lvl-3-bg.png';

const levels: Record<LevelId, LevelConfig> = {
  1: {
    title: 'Море',
    subtitle: '1 уровень',
    bg: lvl1Bg,
  },
  2: {
    title: 'Джунгли',
    subtitle: '2 уровень',
    bg: lvl2Bg,
  },
  3: {
    title: 'Арктика',
    subtitle: '3 уровень',
    bg: lvl3Bg,
  },
};

export const LEVEL_CONFIGS = Object.entries(levels).sort(
  ([lvl1], [lvl2]) => Number(lvl2) - Number(lvl1)
);

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
