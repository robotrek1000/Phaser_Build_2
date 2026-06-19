import type { ReactNode } from 'react';

export interface PrimaryButtonProps {
  disabled?: boolean;
  isPending?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?(): void;
}
