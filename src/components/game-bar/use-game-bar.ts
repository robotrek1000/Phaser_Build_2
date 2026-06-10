import { useState } from 'react';

import { useGame } from '@/contexts/game-context';

export const useGameBar = () => {
  const game = useGame();

  const [isExitConfirmationVisible, setIsExitConfirmationVisible] =
    useState(false);

  const handleCloseClick = () => {
    game?.pause();
    setIsExitConfirmationVisible(true);
  };

  const handleDeclineExit = () => {
    game?.resume();
    setIsExitConfirmationVisible(false);
  };

  return {
    isExitConfirmationVisible,
    handleCloseClick,
    handleDeclineExit,
  };
};
