import { memo } from 'react';

import styles from './distance-progress-bar.module.css';
import { useDistanceProgressBar } from './use-distance-progress-bar';

import type { DistanceProgressBarProps } from './distance-progress-bar.types';

import { StrokedFlagIcon, YachtIcon } from '@/shared/components/icons';
import { cn } from '@/utils';

export const DistanceProgressBar = memo<DistanceProgressBarProps>(
  ({ className }) => {
    const { progress } = useDistanceProgressBar();

    return (
      <div className={cn(className, styles.container)}>
        <div className={styles.icons}>
          <span className={styles.yachtIconContainer}>
            <YachtIcon className={styles.yachtIcon} stroke="#FFFFFF" />
          </span>

          <StrokedFlagIcon className={styles.flagIcon} stroke="#FFFFFF" />
        </div>

        <div className={styles.progressBar}>
          <div
            style={{
              width: `${progress * 100}%`,
            }}
            className={styles.progressLine}
          />
        </div>
      </div>
    );
  }
);
