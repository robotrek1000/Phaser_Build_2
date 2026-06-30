export interface GameObstaclesWarningProps {
  isVisible?: boolean;
  onConfirm?(): void;
}

export type ObstacleType = 'reef' | 'whirlpool';
