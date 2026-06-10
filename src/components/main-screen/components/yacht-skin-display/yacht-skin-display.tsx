import type { FC } from 'react';

import styles from './yacht-skin-display.module.css';

import type { YachtSkinDisplayProps } from './yacht-skin-display.types';

import yachtSkinDefault from '@/assets/yacht-skin-default.png';
import yachtSkinGold from '@/assets/yacht-skin-gold.png';
import { cn } from '@/utils';

export const YachtSkinDisplay: FC<YachtSkinDisplayProps> = ({
  className,
  isGold,
}) => {
  return (
    <div className={cn(className, styles.container)}>
      <img
        className={styles.img}
        src={isGold ? yachtSkinGold : yachtSkinDefault}
        alt="Yacht"
      />
    </div>
  );
};
