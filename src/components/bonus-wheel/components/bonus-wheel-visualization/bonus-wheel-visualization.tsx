import { forwardRef } from 'react';

import { BONUSES_CONFIG } from '../../bonus-wheel.contants';

import styles from './bonus-wheel-visualization.module.css';

import pointer from '@/assets/pointer.svg';

export const BonusWheelVisualization = forwardRef<HTMLImageElement>(
  (_props, ref) => (
    <div className={styles.container}>
      <div className={styles.bonusList}>
        {BONUSES_CONFIG.map(({ type, img, bgColor, size }) => (
          <div
            key={type}
            className={styles.bonus}
            style={{ backgroundColor: bgColor, flexGrow: size }}
          >
            <img className={styles.bonusImage} src={img} alt={type} />
          </div>
        ))}
      </div>

      <img ref={ref} className={styles.pointer} src={pointer} alt="" />
    </div>
  )
);

BonusWheelVisualization.displayName = 'BonusWheelVisualization';
