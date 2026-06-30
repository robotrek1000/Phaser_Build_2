import type { FC } from 'react';

import styles from './exit-confirmation.module.css';

import type { ExitConfirmationProps } from './exit-confirmation.types';

import { PrimaryButton } from '@/shared/components/primary-button';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SecondaryButton } from '@/shared/components/secondary-button';

export const ExitConfirmation: FC<ExitConfirmationProps> = ({
  title = 'Выйти из игры?',
  subtitle,
  isVisible,
  onConfirm,
  onDecline,
  onClose,
}) => {
  return (
    <SailorModal
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

      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </SailorModal>
  );
};
