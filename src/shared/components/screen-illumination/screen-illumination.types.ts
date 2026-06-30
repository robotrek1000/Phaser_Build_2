export type ScreenIlluminationType = 'gameStart' | 'damage';

export interface ScreenIlluminationProps {
  className?: string;
  illumination: ScreenIlluminationType;
  isPaused?: boolean;
  onAnimationEnd(): void;
}
