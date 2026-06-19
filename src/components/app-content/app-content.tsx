import { memo, lazy, Suspense } from 'react';

import { useAppContent } from './use-app-content';

import type { AppContentProps } from './app-content.types';

import { AppError } from '@/components/app-error';
import { AppLoading } from '@/components/app-loading';
import { BonusWheel } from '@/components/bonus-wheel';
import { GameBar } from '@/components/game-bar';
import { GameResults } from '@/components/game-results';

const MainScreen = lazy(() => import('@/components/main-screen'));

export const AppContent = memo<AppContentProps>(({ onContentReady }) => {
  const {
    state,
    isGamePending,
    loadProgress,
    gameProgress,
    gameResults,
    error,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
  } = useAppContent();

  if (error) {
    return <AppError />;
  }

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
        </>
      );
  }
});
