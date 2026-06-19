import styles from './main-screen.module.css';

import type { GameSettings } from '@/game/level-design';
import type {
  ClientLevelNumber,
  ClientYachtImprovementType,
} from '@/shared/types';

export const BACKGROUND: Record<ClientLevelNumber, string> = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
};

export const BOOSTER_SETTING: Record<
  ClientYachtImprovementType,
  keyof GameSettings
> = {
  Frame: 'isBodyReinforced',
  Engine: 'isEngineImproved',
  Shield: 'isShieldReinforced',
  Wheel: 'isSteeringWheelFast',
};
