import { useEffect, useState } from 'react';

import type { MainScreenProps } from '@/components/main-screen/main-screen.types';
import type { ClientLevelNumber } from '@/shared/types';

import { useGame } from '@/contexts/game-context';
import { useClientProfile } from '@/hooks/use-client-profile';
import { useGameSettings } from '@/hooks/use-game-settings';

export const useMainScreen = ({ onContentReady }: MainScreenProps) => {
  const game = useGame();

  const { gameSettings, updateGameSettings } = useGameSettings();

  if (!game) {
    throw new Error('Game is not defined');
  }

  const { data } = useClientProfile();

  const levels = data?.levels;

  const settings = data?.settings;

  const [isHowToPlayGuideVisible, setIsHowToPlayGuideVisible] = useState(
    !settings?.tutorialComplete
  );

  const [isYachtSkinSelectVisible, setIsYachtSkinSelectVisible] =
    useState(false);

  const showHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(true);
  };

  const hideHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(false);
  };

  const showYachtSkinSelect = () => {
    setIsYachtSkinSelectVisible(true);
  };

  const hideYachtSkinSelect = () => {
    setIsYachtSkinSelectVisible(false);
  };

  const handleLevelChange = (level: ClientLevelNumber) => {
    updateGameSettings({ level });
  };

  useEffect(() => {
    onContentReady();
  }, [onContentReady]);

  return {
    level: gameSettings.level,
    isLevelAvailable: levels?.find(
      ({ number }) => number === gameSettings.level
    )?.isAvailable,
    isHowToPlayGuideVisible,
    isYachtSkinSelectVisible,
    showHowToPlayGuide,
    hideHowToPlayGuide,
    showYachtSkinSelect,
    hideYachtSkinSelect,
    handleLevelChange,
  };
};
