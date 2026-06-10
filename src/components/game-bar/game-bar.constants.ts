import type { MotionNodeAnimationOptions } from 'motion-dom';

export const ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
  transition: { duration: 0.3 },
};
