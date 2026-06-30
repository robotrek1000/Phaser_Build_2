import type { SkillWheelDisplayedBonuses } from '@/game';

import buoys from '@/assets/wheel_2.webp';
import energy from '@/assets/wheel_4.webp';

export const BONUSES_CONFIG: Record<SkillWheelDisplayedBonuses, string> = {
  assets: buoys,
  energy: energy,
};
