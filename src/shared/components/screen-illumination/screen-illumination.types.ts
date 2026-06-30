import type { CSSProperties } from 'react';

export type ScreenIlluminationType = 'gameStart' | 'damage';

export interface ScreenIlluminationProps {
  className?: string;
  illumination: ScreenIlluminationType;
  isPaused?: boolean;
  style?: CSSProperties;
  onAnimationEnd(): void;
}
