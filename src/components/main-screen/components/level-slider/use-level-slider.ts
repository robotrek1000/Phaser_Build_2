import type { LevelSliderProps } from './level-slider.types';
import type { LevelId } from '@/game/level-design';
import type { PanInfo } from 'motion';

const swipeThreshold = 80;
const velocityThreshold = 500;

export const useLevelSlider = ({ level, onLevelChange }: LevelSliderProps) => {
  const handleSlideDragEnd = (_event: MouseEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newLevel: LevelId = level;

    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      newLevel = Math.min(level + 1, 3) as LevelId;
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      newLevel = Math.max(level - 1, 1) as LevelId;
    }

    if (newLevel !== level) {
      onLevelChange(newLevel);
    }
  };

  return { handleSlideDragEnd };
};
