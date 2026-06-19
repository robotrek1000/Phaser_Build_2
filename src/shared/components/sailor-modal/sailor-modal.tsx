import type { FC } from 'react';

import styles from './sailor-modal.module.css';

import type { SailorModalProps } from './sailor-modal.types';

import { ModalWindow } from '@/shared/components/modal-window';
import { SailorPicture } from '@/shared/components/sailor-picture';

export const SailorModal: FC<SailorModalProps> = ({
  sailorType,
  children,
  ...modalWindowProps
}) => {
  return (
    <ModalWindow {...modalWindowProps}>
      <div className={styles.sailorImgContainer}>
        <SailorPicture variant={sailorType} />
      </div>

      {children}
    </ModalWindow>
  );
};
