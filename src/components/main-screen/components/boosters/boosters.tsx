import type { FC } from 'react';

import { BOOSTERS } from './boosters.constants';
import styles from './boosters.module.css';

import type { BoostersProps } from './boosters.types';

import whiteCheckmark from '@/assets/checkmark-white.svg';
import { cn } from '@/utils';

export const Boosters: FC<BoostersProps> = ({
  className,
  boostersState,
  onBoosterClick,
}) => {
  return (
    <div className={cn(className, styles.container)}>
      {BOOSTERS.map(({ type, title, img, className }) => (
        <div
          key={type}
          className={styles.booster}
          onClick={() => onBoosterClick(type)}
        >
          <div className={styles.boosterImgContainer}>
            <img className={className} src={img} alt={title} />

            {boostersState[type] && (
              <img
                src={whiteCheckmark}
                className={styles.iconCheckmark}
                alt=""
              />
            )}
          </div>

          <div className={styles.boosterTitle}>{title}</div>
        </div>
      ))}
    </div>
  );
};
