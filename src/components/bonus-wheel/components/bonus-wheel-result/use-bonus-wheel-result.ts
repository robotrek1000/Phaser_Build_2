import { BONUSES_CONFIG } from '../../bonus-wheel.contants';

import type { BonusWheelResultProps } from './bonus-wheel-result.types';

export const useBonusWheelResult = ({
  bonus,
  bonusMultiplier,
  bonusValue,
}: BonusWheelResultProps) => {
  const bonusConfig = BONUSES_CONFIG.find(({ type }) => type === bonus);

  const value = bonusMultiplier ?? bonusValue;

  const bonusValues = bonusConfig
    ? {
        img: bonusConfig.img,
        descriptionLine1: bonusConfig.description,
        descriptionLine2:
          value !== undefined && bonusConfig.getValueDescription(value),
      }
    : undefined;

  return { bonusValues };
};
