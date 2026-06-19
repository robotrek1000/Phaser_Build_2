import type { ReactNode } from 'react';

import type { ClientLevelNumber } from '@/shared/types';

export interface LevelConfig {
  bg: string;
}

export interface LevelSliderProps {
  className?: string;
  level: ClientLevelNumber;
  children?: ReactNode;
  onLevelChange(level: ClientLevelNumber): void;
}
