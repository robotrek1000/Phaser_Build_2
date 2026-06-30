import type { ReactNode } from 'react';

import type { MotionNodeAnimationOptions } from 'motion-dom';

export interface SliderProps {
  className?: string;
  slideClassName?: string;
  slides: ReactNode[];
  activeSlideIndex: number;
  getSlideAnimationConfig?(isActive: boolean): MotionNodeAnimationOptions;
  onSlideChange(slideIndex: number): void;
}
