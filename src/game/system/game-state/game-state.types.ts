export type GameStateTypes = 'intro' | 'playing' | 'finished';

export type SkillWheelBonus = 'coins' | 'assets' | 'time' | 'energy';

export type SkillWheelDisplayedBonuses = Exclude<
  SkillWheelBonus,
  'coins' | 'time'
>;

export type SkillWheelFixedBonuses = Exclude<
  SkillWheelBonus,
  'assets' | 'energy'
>;

export type SkillWheelDisplayedBonusesValues = {
  type: SkillWheelDisplayedBonuses;
  amount: number;
}[];
