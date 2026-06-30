import { SLIDE_ANIMATION_CONFIG } from './slider.constants';

import type { SliderProps } from './slider.types';
import type { PanInfo } from 'motion';

const swipeThreshold = 80;
const velocityThreshold = 500;

export const useSlider = ({
  slides,
  activeSlideIndex,
  getSlideAnimationConfig = SLIDE_ANIMATION_CONFIG,
  onSlideChange,
}: SliderProps) => {
  const handleSlideDragEnd = (_event: MouseEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newActiveSlideIndex = activeSlideIndex;

    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      newActiveSlideIndex = Math.min(
        newActiveSlideIndex + 1,
        slides.length - 1
      );
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      newActiveSlideIndex = Math.max(newActiveSlideIndex - 1, 0);
    }

    if (newActiveSlideIndex !== activeSlideIndex) {
      onSlideChange(newActiveSlideIndex);
    }
  };

  return {
    getSlideAnimationConfig,
    handleSlideDragEnd,
  };
};
