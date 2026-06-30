import type { BoosterKey } from './app-content.types';
import type { ClientYachtImprovementType } from '@/shared/types';

export const YACHT_IMPROVEMENT_TO_BOOSTER_MAP: Record<
  ClientYachtImprovementType,
  BoosterKey
> = {
  Engine: 'isEngineImproved',
  Frame: 'isBodyReinforced',
  Shield: 'isShieldReinforced',
  Wheel: 'isSteeringWheelFast',
};
