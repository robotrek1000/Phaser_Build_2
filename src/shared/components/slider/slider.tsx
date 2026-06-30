import type { FC } from 'react';

import { motion } from 'motion/react';

import { SLIDE_DRAG_CONFIG, SLIDER_ANIMATION_CONFIG } from './slider.constants';
import styles from './slider.module.css';

import type { SliderProps } from './slider.types';

import { useSlider } from '@/shared/components/slider/use-slider';
import { cn } from '@/utils';

export const Slider: FC<SliderProps> = (props) => {
  const {
    isTrackActive,
    getSlideAnimationConfig,
    handleSlideDragEnd,
    handleAnimationStart,
    handleAnimationComplete,
  } = useSlider(props);

  return (
    <div className={cn(props.className, styles.container)}>
      <motion.div
        {...SLIDE_DRAG_CONFIG}
        {...SLIDER_ANIMATION_CONFIG(props.activeSlideIndex)}
        className={cn(
          styles.track,
          isTrackActive ? styles.activeTrack : styles.inactiveTrack
        )}
        onDragEnd={handleSlideDragEnd}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {props.slides.map((slideContent, index) => (
          <motion.div
            {...getSlideAnimationConfig(index === props.activeSlideIndex)}
            key={index}
            className={cn(styles.slide, props.slideClassName)}
          >
            {slideContent}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
