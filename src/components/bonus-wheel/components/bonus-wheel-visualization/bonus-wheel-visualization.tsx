import { forwardRef } from 'react';

import { BONUSES_CONFIG } from '../../bonus-wheel.contants';

import styles from './bonus-wheel-visualization.module.css';

import type { BonusWheelVisualizationProps } from './bonus-wheel-visualization.types.ts';

import { RoundedTriangleIcon } from '@/shared/components/icons';

export const BonusWheelVisualization = forwardRef<
  SVGSVGElement,
  BonusWheelVisualizationProps
>((_props, pointerElementRef) => {
  return (
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

      <RoundedTriangleIcon
        ref={pointerElementRef}
        className={styles.pointer}
      />
    </div>
  );
});
