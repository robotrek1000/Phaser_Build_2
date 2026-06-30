import { useState } from 'react';

import { BOOSTERS_ORDER } from './boosters.constants';

import type {
  ClientYachtImprovement,
  ClientYachtImprovementType,
} from '@/shared/types';

import { useClientProfile } from '@/hooks/use-client-profile';
import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const useBoosters = () => {
  const [selectedBoosterType, setSelectedBoosterType] =
    useState<ClientYachtImprovementType>();

  const { data } = useClientProfile();

  const boosters = data?.yachtImprovements;

  const sortedBoosters = BOOSTERS_ORDER.reduce<ClientYachtImprovement[]>(
    (acc, boosterType) => {
      const booster = boosters?.find(({ type }) => type === boosterType);

      if (booster) {
        acc.push(booster);
      }

      return acc;
    },
    []
  );

  const selectedBooster = selectedBoosterType
    ? boosters?.find(({ type }) => type === selectedBoosterType)
    : undefined;

  const { playInteractionSound } = useUiInteractionSound();

  const handleBoosterClick = (booster: ClientYachtImprovementType) => {
    setSelectedBoosterType(booster);
    playInteractionSound();
  };

  const handleCloseBoosterModal = () => {
    setSelectedBoosterType(undefined);
  };

  return {
    selectedBooster,
    sortedBoosters,
    handleBoosterClick,
    handleCloseBoosterModal,
  };
};
