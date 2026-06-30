import type { FC } from 'react';

import styles from './app-loading.module.css';

import type { AppLoadingProps } from './app-loading.types';

import { LaurelLeftIcon, LaurelRightIcon } from '@/shared/components/icons';
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
      <div className={styles.appNameContainer}>
        <LaurelLeftIcon
          className={cn(styles.appNameLaurel, styles.appNameLaurelLeft)}
        />

        <div className={styles.appName}>{APP_NAME}</div>

        <LaurelRightIcon
          className={cn(styles.appNameLaurel, styles.appNameLaurelRight)}
        />
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressLine}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
