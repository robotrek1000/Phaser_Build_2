import type { FC } from 'react';

import { BONUSES_CONFIG } from './bonuses.constants';
import styles from './bonuses.module.css';
import { useBonuses } from './use-bonuses';

export const Bonuses: FC = () => {
  const { bonuses } = useBonuses();

  if (!bonuses.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      {bonuses.map(({ type, amount }) => (
        <div key={type} className={styles.item}>
          <img className={styles.itemImg} src={BONUSES_CONFIG[type]} alt="" />

          <div className={styles.itemText}>x{amount}</div>
        </div>
      ))}
    </div>
  );
};
