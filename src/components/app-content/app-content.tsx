import { lazy, memo, Suspense } from 'react';

import { useAppContent } from './use-app-content';

import type { AppContentProps } from './app-content.types';

import { AppLoading } from '@/components/app-loading';

const MainScreen = lazy(() => import('@/components/main-screen'));
const GameBar = lazy(() => import('@/components/game-bar'));
const BonusWheel = lazy(() => import('@/components/bonus-wheel'));
const GameResults = lazy(() => import('@/components/game-results'));
const GameOnboarding = lazy(() => import('@/components/game-onboarding'));
const GameStartAnimation = lazy(
  () => import('@/shared/components/game-start-animation')
);
const ScreenIllumination = lazy(
  () => import('@/shared/components/screen-illumination')
);

export const AppContent = memo<AppContentProps>(({ onContentReady }) => {
  const {
    state,
    isGamePending,
    isGameOnboardingVisible,
    loadProgress,
    gameProgress,
    gameResults,
    isGameStartAnimationVisible,
    isGameStartAnimationPaused,
    screenIllumination,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
    closeGameOnboarding,
    hideGameStartAnimation,
    hideScreenIllumination,
  } = useAppContent();

  switch (state) {
    case 'main':
      return (
        <Suspense fallback={<AppLoading progress={0.99} isAnimationDisabled />}>
          <MainScreen
            isGamePending={isGamePending}
            onContentReady={onContentReady}
            onStartGame={startGame}
          />
        </Suspense>
      );
    case 'loading':
      return <AppLoading progress={loadProgress} />;
    default:
      return (
        <>
          <GameBar
            isVisible={state === 'playing' || state === 'bonusWheel'}
            onClose={leaveGame}
          />

          <BonusWheel
            isVisible={state === 'bonusWheel'}
            gameProgress={gameProgress}
            onCollectBonus={collectBonus}
          />

          <GameResults
            isVisible={state === 'result'}
            gameResults={gameResults?.sessionResult}
            onGoToMain={goToMain}
            onPlayAgain={playAgain}
          />

          <GameOnboarding
            isVisible={isGameOnboardingVisible}
            onClose={closeGameOnboarding}
          />

          {isGameStartAnimationVisible && (
            <GameStartAnimation
              isPaused={isGameStartAnimationPaused}
              onAnimationEnd={hideGameStartAnimation}
            />
          )}

          {screenIllumination && (
            <ScreenIllumination
              illumination={screenIllumination}
              onAnimationEnd={hideScreenIllumination}
            />
          )}
        </>
      );
  }
});
