import type { SkillWheelBonus } from '@/game/system/game-state';

export interface Reward {
  iconKey: string;
  title: string;
  bodyLine1: string;
  bodyLine2: string;
  bonus: SkillWheelBonus;
}

export type RewardNumber = 1 | 2 | 3 | 4;

export type RewardsConfig = Record<RewardNumber, Reward>;
