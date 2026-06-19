import type { RefObject } from 'react';

import type { SkillWheelBonus } from '@/game';

export interface BonusWheelVisualizationProps {
  bonus?: SkillWheelBonus;
  pointerElementRef: RefObject<HTMLImageElement | null>;
}
