import type { FC } from 'react';

import styles from './bonus-wheel-modal-window.module.css';

import type { BonusWheelModalWindowProps } from './bonus-wheel-modal-window.types.ts';

import { ModalWindow } from '@/shared/components/modal-window';
import { PrimaryButton } from '@/shared/components/primary-button';
import { TextArt } from '@/shared/components/text-art';

export const BonusWheelModalWindow: FC<BonusWheelModalWindowProps> = ({
  isVisible,
  children,
  onStopButtonClick,
}) => {
  return (
    <ModalWindow
      className={styles.modalWindow}
      isOpen={isVisible}
      hasBackdrop={false}
      variant="blue"
      footer={
        <PrimaryButton className={styles.stopBtn} onClick={onStopButtonClick}>
          Остановить
        </PrimaryButton>
      }
    >
      <TextArt className={styles.title} title="Рулетка" subtitle="НАГРАД" />

      <div className={styles.description}>
        Остановите рулетку, что бы получить
        <br />
        награду
      </div>

      <div className={styles.divider} />

      {children}
    </ModalWindow>
  );
};
