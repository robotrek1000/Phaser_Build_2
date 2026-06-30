import type { FC } from 'react';

import styles from './coins-balance.module.css';
import { useCoinsBalance } from './use-coins-balance';

import type { CoinsBalanceProps } from './coins-balance.types';

import coin from '@/assets/coin.webp';
import { cn } from '@/utils';

export const CoinsBalance: FC<CoinsBalanceProps> = ({ className }) => {
  const { amount } = useCoinsBalance();

  return (
    <div className={cn(className, styles.container)}>
      <img src={coin} alt="Coins" className={styles.icon} />

      <div className={styles.amount}>{amount}</div>
    </div>
  );
};
