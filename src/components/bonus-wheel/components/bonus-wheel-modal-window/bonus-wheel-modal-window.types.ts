import type { ReactNode } from 'react';

export interface BonusWheelModalWindowProps {
  isVisible?: boolean;
  children?: ReactNode;
  onStopButtonClick(): void;
}
