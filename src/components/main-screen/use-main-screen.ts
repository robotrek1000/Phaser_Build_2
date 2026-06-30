import { useEffect, useState } from 'react';

import type { MainScreenProps } from '@/components/main-screen/main-screen.types';
import type { ClientLevelNumber } from '@/shared/types';

import { useGame } from '@/contexts/game-context';
import { useClientProfile } from '@/hooks/use-client-profile';
import { useGameSettings } from '@/hooks/use-game-settings';
import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const useMainScreen = ({ onContentReady }: MainScreenProps) => {
  const game = useGame();

  const { gameSettings, updateGameSettings } = useGameSettings();

  if (!game) {
    throw new Error('Game is not defined');
  }

  const { data } = useClientProfile();

  const levels = data?.levels;

  const [isHowToPlayGuideVisible, setIsHowToPlayGuideVisible] = useState(false);

  const [isYachtSkinSelectVisible, setIsYachtSkinSelectVisible] =
    useState(false);

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const { playInteractionSound } = useUiInteractionSound();

  const showHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(true);
  };

  const hideHowToPlayGuide = () => {
    setIsHowToPlayGuideVisible(false);
  };

  const showYachtSkinSelect = () => {
    setIsYachtSkinSelectVisible(true);
    playInteractionSound();
  };

  const hideYachtSkinSelect = () => {
    setIsYachtSkinSelectVisible(false);
  };

  const showSettings = () => {
    setIsSettingsVisible(true);
  };

  const hideSettings = () => {
    setIsSettingsVisible(false);
  };

  const showFeedback = () => {
    setIsSettingsVisible(false);
    setIsFeedbackVisible(true);
  };

  const hideFeedback = () => {
    setIsFeedbackVisible(false);
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
    isSettingsVisible,
    isFeedbackVisible,
    showHowToPlayGuide,
    hideHowToPlayGuide,
    showYachtSkinSelect,
    hideYachtSkinSelect,
    handleLevelChange,
    showSettings,
    hideSettings,
    showFeedback,
    hideFeedback,
  };
};
