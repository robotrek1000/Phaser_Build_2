import styles from './modal-window.module.css';

import type {
  ModalWindowSailorType,
  ModalWindowTopGradient,
  ModalWindowVariant,
} from './modal-window.types';
import type { MotionNodeAnimationOptions } from 'motion-dom';

import sailorFarewell from '@/assets/sailor-farewell.png';
import happySailor from '@/assets/sailor-happy.png';
import sailorLookingFar from '@/assets/sailor-looking-far.png';
import normalSailor from '@/assets/sailor-normal.png';
import sadSailor from '@/assets/sailor-sad.png';

export const CONTAINER_BACKGROUND: Record<ModalWindowVariant, string> = {
  blue: styles.containerBlue,
  gray: styles.containerGray,
};

export const TOP_GRADIENT: Record<ModalWindowTopGradient, string> = {
  blue: styles.containerTopGradientBlue,
  gray: styles.containerTopGradientGray,
  green: styles.containerTopGradientGreen,
  orange: styles.containerTopGradientOrange,
};

export const SAILOR: Record<ModalWindowSailorType, string> = {
  happy: happySailor,
  normal: normalSailor,
  sad: sadSailor,
  lookingFar: sailorLookingFar,
  farewell: sailorFarewell,
};

export const BACKDROP_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.1 },
};

export const MODAL_WINDOW_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { x: '-50%', y: '100%' },
  animate: { x: '-50%', y: '0' },
  exit: { x: '-50%', y: '100%' },
  transition: { duration: 0.2 },
};
