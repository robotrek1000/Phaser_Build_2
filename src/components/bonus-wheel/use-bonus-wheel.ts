import { useRef, useState } from 'react';

import {
  BONUSES_CONFIG,
  FIXED_BONUSES_TYPES,
  MULTIPLIABLE_BONUSES_TYPES,
} from './bonus-wheel.contants';

import type { BonusWheelProps } from './bonus-wheel.types.ts';
import type { GameStateUpdatePayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import {
  FIXED_BONUSES,
  type SkillWheelBonus,
  type SkillWheelDisplayedBonuses,
  type SkillWheelFixedBonuses,
} from '@/game';

const pickByPointerPosition = <T extends { size: number }>(
  items: T[],
  pointer: SVGSVGElement
): T | undefined => {
  if (!pointer.parentElement) {
    return;
  }

  const leftPx = parseFloat(getComputedStyle(pointer).left);

  const leftRatio = leftPx / pointer.parentElement.clientWidth;

  const totalSize = items.reduce((sum, item) => sum + item.size, 0);

  let accumulated = 0;

  return items.find(({ size }) => {
    accumulated += size / totalSize;

    return leftRatio <= accumulated;
  });
};

const getBonusMultiplier = (
  bonus?: SkillWheelBonus,
  gameProgress?: GameStateUpdatePayload
) => {
  if (
    !bonus ||
    !gameProgress ||
    !MULTIPLIABLE_BONUSES_TYPES.includes(bonus as SkillWheelDisplayedBonuses)
  ) {
    return;
  }

  const currentBonusState = gameProgress.bonuses.find(
    ({ type }) => type === bonus
  );

  return currentBonusState ? currentBonusState.amount + 1 : 2;
};

const getBonusValue = (bonus?: SkillWheelBonus) => {
  if (
    !bonus ||
    !FIXED_BONUSES_TYPES.includes(bonus as SkillWheelFixedBonuses)
  ) {
    return;
  }

  return FIXED_BONUSES[bonus as SkillWheelFixedBonuses];
};

export const useBonusWheel = ({
  gameProgress,
  onCollectBonus,
}: BonusWheelProps) => {
  const [bonus, setBonus] = useState<SkillWheelBonus>();

  const pointerElementRef = useRef<SVGSVGElement>(null);

  const game = useGame();

  const soundManager = game?.soundManager;

  const handleStopButtonClick = () => {
    const pointer = pointerElementRef.current;

    if (!pointer || !pointer.parentElement) {
      return;
    }

    pointer.style.animationPlayState = 'paused';

    const bonus = pickByPointerPosition(BONUSES_CONFIG, pointer)?.type;

    if (bonus) {
      soundManager?.playSound('chords3');

      setTimeout(() => {
        setBonus(bonus);
      }, 300);
    }
  };

  const handleContinueButtonClick = () => {
    if (!bonus) {
      return;
    }

    setBonus(undefined);
    onCollectBonus(bonus);
  };

  return {
    bonus,
    bonusMultiplier: getBonusMultiplier(bonus, gameProgress),
    bonusValue: getBonusValue(bonus),
    pointerElementRef,
    handleStopButtonClick,
    handleContinueButtonClick,
  };
};
