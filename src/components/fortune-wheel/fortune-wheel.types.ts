import type { SkillWheelBonus } from '@/game';

export interface FortuneWheelProps {
  isVisible?: boolean;
  onCollectBonus(bonus: SkillWheelBonus): void;
}
