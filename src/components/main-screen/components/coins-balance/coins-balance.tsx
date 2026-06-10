import type { FC } from 'react';

import styles from './coins-balance.module.css';

import type { CoinsBalanceProps } from './coins-balance.types';

import coin from '@/assets/coin.png';
import { cn } from '@/utils';

export const CoinsBalance: FC<CoinsBalanceProps> = ({ className, amount }) => {
  return (
    <div className={cn(className, styles.container)}>
      <img src={coin} alt="Coins" className={styles.icon} />

      <div className={styles.amount}>{amount}</div>
    </div>
  );
};
