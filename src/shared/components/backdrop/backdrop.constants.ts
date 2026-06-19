import type { MotionNodeAnimationOptions } from 'motion-dom';

export const ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.1 },
};
