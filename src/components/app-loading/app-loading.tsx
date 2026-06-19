import type { FC } from 'react';

import styles from './app-loading.module.css';

import type { AppLoadingProps } from './app-loading.types';

import { APP_NAME } from '@/shared/constants';
import { cn } from '@/utils';

export const AppLoading: FC<AppLoadingProps> = ({
  isAnimationDisabled,
  progress,
}) => {
  return (
    <div
      className={cn(
        styles.container,
        !isAnimationDisabled && styles.animatedContainer
      )}
    >
      <div className={styles.appName}>{APP_NAME}</div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressLine}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
