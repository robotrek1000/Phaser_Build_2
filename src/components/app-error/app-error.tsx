import type { FC } from 'react';

import styles from './app-error.module.css';

import type { AppErrorProps } from './app-error.types';

import { PrimaryButton } from '@/components/shared/components/primary-button';

export const AppError: FC<AppErrorProps> = ({ error }) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>{JSON.stringify(error)}</div>

      <PrimaryButton
        onClick={() => window.location.reload()}
        className={styles.reloadBtn}
      >
        Перезагрузить
      </PrimaryButton>
    </div>
  );
};
