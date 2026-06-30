export interface GameOnboardingProps {
  isVisible?: boolean;
  onClose(): void;
}

export type Screen = 'howToPlay' | 'obstaclesWarning';
