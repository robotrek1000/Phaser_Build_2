import type { ReactNode } from 'react';

export type SecondaryButtonSize = 's' | 'm';

export interface SecondaryButtonProps {
  className?: string;
  size?: SecondaryButtonSize;
  children?: ReactNode;
  onClick?(): void;
}
