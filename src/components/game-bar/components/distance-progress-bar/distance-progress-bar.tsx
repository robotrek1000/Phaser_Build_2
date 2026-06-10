import { memo } from 'react';

import styles from './distance-progress-bar.module.css';
import { useDistanceProgressBar } from './use-distance-progress-bar';

import type { DistanceProgressBarProps } from './distance-progress-bar.types';

import blackFlag from '@/assets/flag-black.png';
import blackYacht from '@/assets/yacht-black.png';
import { cn } from '@/utils';

export const DistanceProgressBar = memo<DistanceProgressBarProps>(
  ({ className }) => {
    const { progress } = useDistanceProgressBar();

    return (
      <div className={cn(className, styles.container)}>
        <div className={styles.icons}>
          <span className={styles.yachtIconContainer}>
            <img src={blackYacht} alt="Yacht" className={styles.yachtIcon} />
          </span>

          <img src={blackFlag} alt="Flag" className={styles.flagIcon} />
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
