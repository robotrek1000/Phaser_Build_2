import type { ReactNode } from 'react';

import type { LevelId } from '@/game/level-design';

export interface LevelConfig {
  title: ReactNode;
  subtitle: ReactNode;
  bg: string;
}

export interface LevelSliderProps {
  className?: string;
  level: LevelId;
  children?: ReactNode;
  onLevelChange(level: LevelId): void;
}
