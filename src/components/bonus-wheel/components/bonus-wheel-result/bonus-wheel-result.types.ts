import type { SkillWheelBonus } from '@/game';

export interface BonusWheelResultProps {
  bonus: SkillWheelBonus;
  bonusMultiplier?: number;
  bonusValue?: number;
  onContinueButtonClick(): void;
}
