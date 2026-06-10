import styles from './secondary-button.module.css';

import type { SecondaryButtonSize } from './secondary-button.types';

export const SIZE: Record<SecondaryButtonSize, string> = {
  m: styles.sizeM,
  s: styles.sizeS,
};
