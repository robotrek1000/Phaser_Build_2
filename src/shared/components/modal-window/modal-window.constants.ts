import styles from './modal-window.module.css';

import type {
  ModalWindowTopGradient,
  ModalWindowVariant,
} from './modal-window.types';
import type { MotionNodeAnimationOptions } from 'motion-dom';

export const CONTAINER_BACKGROUND: Record<ModalWindowVariant, string> = {
  blue: styles.containerBlue,
  darkBlue: styles.containerDarkBlue,
  gray: styles.containerGray,
  green: styles.containerGreen,
  gold: styles.containerGold,
  violet: styles.containerViolet,
};

export const TOP_GRADIENT: Record<ModalWindowTopGradient, string> = {
  blue: styles.containerTopGradientBlue,
  brightBlue: styles.containerTopGradientBrightBlue,
  gray: styles.containerTopGradientGray,
  green: styles.containerTopGradientGreen,
  brightGreen: styles.containerTopGradientBrightGreen,
  orange: styles.containerTopGradientOrange,
  yellow: styles.containerTopGradientYellow,
  violet: styles.containerTopGradientViolet,
};

export const MODAL_WINDOW_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { x: '-50%', y: '100%' },
  animate: { x: '-50%', y: '0' },
  exit: { x: '-50%', y: '100%' },
  transition: { duration: 0.2 },
};
