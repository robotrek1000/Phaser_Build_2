import styles from './screen-illumination.module.css';

import type { ScreenIlluminationType } from './screen-illumination.types';

export const ILLUMINATION_CONFIG: Record<ScreenIlluminationType, string> = {
  gameStart: styles.gameStart,
  damage: styles.damage,
};
