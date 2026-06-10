import { memo } from 'react';

import styles from './energy-progress-bar.module.css';
import { useEnergyProgressBar } from './use-energy-progress-bar';

import type { EnergyProgressBarProps } from './energy-progress-bar.types';

import energyShield from '@/assets/energy-shield.png';
import { cn } from '@/utils';

export const EnergyProgressBar = memo<EnergyProgressBarProps>(
  ({ className }) => {
    const { progress } = useEnergyProgressBar();

    return (
      <div className={cn(className, styles.container)}>
        <img src={energyShield} alt="Energy shield" className={styles.icon} />

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
