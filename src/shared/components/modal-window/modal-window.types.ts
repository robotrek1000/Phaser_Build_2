import type { ReactNode } from 'react';

export type ModalWindowVariant =
  | 'blue'
  | 'darkBlue'
  | 'gray'
  | 'green'
  | 'gold'
  | 'violet';

export type ModalWindowTopGradient =
  | 'blue'
  | 'brightBlue'
  | 'green'
  | 'brightGreen'
  | 'orange'
  | 'gray'
  | 'yellow'
  | 'violet';

export interface ModalWindowProps {
  isOpen?: boolean;
  hasBackdrop?: boolean;
  className?: string;
  variant?: ModalWindowVariant;
  topGradient?: ModalWindowTopGradient;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?(): void;
}
