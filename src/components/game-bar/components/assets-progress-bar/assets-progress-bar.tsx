import { memo } from 'react';

import styles from './assets-progress-bar.module.css';
import { useAssetsProgressBar } from './use-assets-progress-bar';

import type { AssetsProgressBarProps } from '@/components/game-bar/components/assets-progress-bar/assets-progress-bar.types';

import briefcase from '@/assets/briefcase.webp';
import { cn } from '@/utils';

export const AssetsProgressBar = memo<AssetsProgressBarProps>(
  ({ className }) => {
    const { progress, iconClassName, gradient, isIncreased } =
      useAssetsProgressBar();

    return (
      <div className={cn(className, styles.container)}>
        <div className={styles.iconContainer}>
          <img
            src={briefcase}
            alt="Briefcase"
            className={cn(styles.icon, iconClassName)}
          />
        </div>

        <div
          className={cn(
            styles.progressBar,
            isIncreased ? styles.progressBarIncreased : styles.progressBarNormal
          )}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
            }}
            className={styles.progressLine}
          />
        </div>
      </div>
    );
  }
);
