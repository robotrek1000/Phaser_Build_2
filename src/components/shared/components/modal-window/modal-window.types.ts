import type { ReactNode } from 'react';

export type ModalWindowVariant = 'blue' | 'gray';

export type ModalWindowTopGradient = 'blue' | 'green' | 'orange' | 'gray';

export type ModalWindowSailorType =
  | 'normal'
  | 'happy'
  | 'sad'
  | 'lookingFar'
  | 'farewell';

export interface ModalWindowProps {
  isOpen?: boolean;
  className?: string;
  variant?: ModalWindowVariant;
  topGradient?: ModalWindowTopGradient;
  sailorType?: ModalWindowSailorType;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?(): void;
}
