import type { FC } from 'react';

import styles from './app-loading.module.css';

import type { AppLoadingProps } from './app-loading.types';

export const AppLoading: FC<AppLoadingProps> = ({ progress }) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>Загрузка...</div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressLine}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
