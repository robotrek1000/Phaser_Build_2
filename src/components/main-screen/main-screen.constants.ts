import styles from './main-screen.module.css';

import type { BoosterType } from './components/boosters';
import type { GameSettings, LevelId } from '@/game/level-design';

export const BACKGROUND: Record<LevelId, string> = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
};

export const BOOSTER_SETTING: Record<BoosterType, keyof GameSettings> = {
  body: 'isBodyReinforced',
  engine: 'isEngineImproved',
  shield: 'isShieldReinforced',
  steeringWheel: 'isSteeringWheelFast',
};
