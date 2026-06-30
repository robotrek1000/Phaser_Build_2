import type { LevelSliderProps } from './level-slider.types';

import { useClientProfile } from '@/hooks/use-client-profile';
import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const useLevelSlider = ({ level, onLevelChange }: LevelSliderProps) => {
  const { data } = useClientProfile();

  const levels = [...(data?.levels ?? [])].sort(
    ({ number: levelA }, { number: levelB }) => levelA - levelB
  );

  const activeSlideIndex = levels.findIndex(({ number }) => number === level);

  const currentLevel = levels[activeSlideIndex];

  const { playSwipeSound } = useUiInteractionSound();

  const handleSlideChange = (index: number) => {
    playSwipeSound();
    onLevelChange(levels[index].number);
  };

  return { levels, activeSlideIndex, currentLevel, handleSlideChange };
};
