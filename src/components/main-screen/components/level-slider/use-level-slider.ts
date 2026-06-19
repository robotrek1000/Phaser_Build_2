import type { LevelSliderProps } from './level-slider.types';
import type { ClientLevelNumber } from '@/shared/types';
import type { PanInfo } from 'motion';

import { useClientProfile } from '@/hooks/use-client-profile';

const swipeThreshold = 80;
const velocityThreshold = 500;

export const useLevelSlider = ({ level, onLevelChange }: LevelSliderProps) => {
  const { data } = useClientProfile();

  const levels = [...(data?.levels ?? [])].sort(
    ({ number: levelA }, { number: levelB }) => levelB - levelA
  );

  const handleSlideDragEnd = (_event: MouseEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newLevel: ClientLevelNumber = level;

    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      newLevel = Math.min(level + 1, 3) as ClientLevelNumber;
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      newLevel = Math.max(level - 1, 1) as ClientLevelNumber;
    }

    if (newLevel !== level) {
      onLevelChange(newLevel);
    }
  };

  return { levels, handleSlideDragEnd };
};
