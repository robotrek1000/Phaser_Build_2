import type { SkillWheelBonus } from '@/game';
import type { GameStateUpdatePayload } from '@/game/game.types';

export interface BonusWheelProps {
  isVisible?: boolean;
  gameProgress?: GameStateUpdatePayload;
  onCollectBonus(bonus: SkillWheelBonus): void;
}

export interface BonusConfig {
  type: SkillWheelBonus;
  img: string;
  bgColor: string;
  size: number;
  description: string;
  getValueDescription: (value: number) => string;
}
