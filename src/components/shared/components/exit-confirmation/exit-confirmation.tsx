import type { FC } from 'react';

import styles from './exit-confirmation.module.css';

import type { ExitConfirmationProps } from './exit-confirmation.types';

import { ModalWindow } from '@/components/shared/components/modal-window';
import { PrimaryButton } from '@/components/shared/components/primary-button';
import { SecondaryButton } from '@/components/shared/components/secondary-button';
import { Separator } from '@/components/shared/components/separator';

export const ExitConfirmation: FC<ExitConfirmationProps> = ({
  title = 'Выйти из игры?',
  isVisible,
  onConfirm,
  onDecline,
  onClose,
}) => {
  return (
    <ModalWindow
      isOpen={isVisible}
      variant="gray"
      topGradient="gray"
      sailorType="farewell"
      className={styles.modalWindow}
      footer={
        <div className={styles.buttonsBar}>
          <SecondaryButton onClick={onConfirm}>да</SecondaryButton>

          <PrimaryButton onClick={onDecline}>нет</PrimaryButton>
        </div>
      }
      onClose={onClose}
    >
      <div className={styles.title}>{title}</div>

      <Separator className={styles.separator} />
    </ModalWindow>
  );
};
