import styles from './modal-window.module.css';

import type {
  ModalWindowTopGradient,
  ModalWindowVariant,
} from './modal-window.types';
import type { ColoredEllipseBackgroundProps } from '@/shared/components/colored-ellipse-background';
import type { MotionNodeAnimationOptions } from 'motion-dom';

export const CONTAINER_BACKGROUND: Record<ModalWindowVariant, string> = {
  blue: styles.containerBlue,
  darkBlue: styles.containerDarkBlue,
  gray: styles.containerGray,
  green: styles.containerGreen,
  gold: styles.containerGold,
  violet: styles.containerViolet,
};

export const TOP_GRADIENT: Record<
  ModalWindowTopGradient,
  ColoredEllipseBackgroundProps
> = {
  blue: { size: 'm', color: '#08B4FE' },
  brightBlue: { size: 'l', color: '#02B1F1' },
  gray: { size: 'm', color: '#D9D9D9' },
  green: { size: 'm', color: '#2FFE55' },
  brightGreen: { size: 'l', color: '#02F152' },
  orange: { size: 'm', color: '#FE8708' },
  red: { size: 'm', color: '#FF4E00' },
  yellow: { size: 'l', color: '#F1E902' },
  violet: { size: 'l', color: '#D502F1' },
};

export const MODAL_WINDOW_ANIMATION_CONFIG: MotionNodeAnimationOptions = {
  initial: { x: '-50%', y: '100%' },
  animate: { x: '-50%', y: '0' },
  exit: { x: '-50%', y: '100%' },
  transition: { duration: 0.2 },
};
