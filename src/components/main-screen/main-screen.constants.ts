import styles from './main-screen.module.css';

import type { ClientLevelNumber } from '@/shared/types';

export const BACKGROUND: Record<ClientLevelNumber, string> = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
};
