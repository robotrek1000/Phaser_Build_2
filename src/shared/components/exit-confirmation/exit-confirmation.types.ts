import type { ReactNode } from 'react';

export interface ExitConfirmationProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  isVisible?: boolean;
  onConfirm(): void;
  onDecline(): void;
  onClose(): void;
}
