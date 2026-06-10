import styles from './icon-button.module.css';

import type { IconType } from './icon-button.types';

export const ICON: Record<IconType, string> = {
  close: styles.closeBtn,
  exit: styles.exitBtn,
  settings: styles.settingsBtn,
};
