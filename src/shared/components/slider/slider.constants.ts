import type {
  MotionNodeAnimationOptions,
  MotionNodeDraggableOptions,
} from 'motion-dom';

export const SLIDER_ANIMATION_CONFIG = (
  activeIndex: number
): MotionNodeAnimationOptions => ({
  initial: false,
  animate: {
    x: `calc(${activeIndex} * -1 * 100%)`,
  },
  transition: { duration: 0.3 },
});

export const SLIDE_ANIMATION_CONFIG = (
  isActive: boolean
): MotionNodeAnimationOptions => ({
  initial: false,
  animate: {
    scale: isActive ? 1.6 : 0.5,
  },
  transition: { duration: 0.3 },
});

export const SLIDE_DRAG_CONFIG: MotionNodeDraggableOptions = {
  drag: 'x',
  dragMomentum: false,
  dragElastic: 0.08,
  dragConstraints: { left: 0, right: 0 },
};