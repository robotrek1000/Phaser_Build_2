import type { SkillWheelDisplayedBonuses } from '@/game';

import buoys from '@/assets/wheel_2.png';
import energy from '@/assets/wheel_4.png';

export const BONUSES_CONFIG: Record<SkillWheelDisplayedBonuses, string> = {
  assets: buoys,
  energy: energy,
};
