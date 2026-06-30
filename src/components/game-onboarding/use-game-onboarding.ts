import { useState } from 'react';

import type { GameOnboardingProps, Screen } from './game-onboarding.types';

export const useGameOnboarding = ({ onClose }: GameOnboardingProps) => {
  const [screen, setScreen] = useState<Screen>('howToPlay');

  const handleHowToPlayConfirm = () => {
    setScreen('obstaclesWarning');
  };

  const handleObstaclesWarningConfirm = () => {
    setScreen('howToPlay');
    onClose();
  };

  return {
    screen,
    handleHowToPlayConfirm,
    handleObstaclesWarningConfirm,
  };
};
