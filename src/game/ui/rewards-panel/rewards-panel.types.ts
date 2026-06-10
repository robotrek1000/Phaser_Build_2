import type { SkillWheelBonus } from '@/game/system/game-state';

export type VisibleRewardBonus = Exclude<SkillWheelBonus, 'coins'>;

export type RewardSlot = {
  container: Phaser.GameObjects.Container;
  frame: Phaser.GameObjects.Graphics;
  icon: Phaser.GameObjects.Image;
  amountText: Phaser.GameObjects.Text;
};
