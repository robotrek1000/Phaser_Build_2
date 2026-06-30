import { type FC, lazy } from 'react';

import { useGameOnboarding } from './use-game-onboarding';

import type { GameOnboardingProps } from './game-onboarding.types';

const HowToPlayGuide = lazy(() => import('@/components/how-to-play-guide'));
const GameObstaclesWarning = lazy(
  () => import('@/components/game-obstacles-warning')
);

export const GameOnboarding: FC<GameOnboardingProps> = (props) => {
  const { screen, handleHowToPlayConfirm, handleObstaclesWarningConfirm } =
    useGameOnboarding(props);

  return (
    <>
      <HowToPlayGuide
        isVisible={props.isVisible && screen === 'howToPlay'}
        onConfirm={handleHowToPlayConfirm}
      />

      <GameObstaclesWarning
        isVisible={props.isVisible && screen === 'obstaclesWarning'}
        onConfirm={handleObstaclesWarningConfirm}
      />
    </>
  );
};
