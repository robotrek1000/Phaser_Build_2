import { memo } from 'react';

import { useAppContent } from './use-app-content';

import { AppError } from '@/components/app-error';
import { AppLoading } from '@/components/app-loading';
import { FortuneWheel } from '@/components/fortune-wheel';
import { GameBar } from '@/components/game-bar';
import { GameResults } from '@/components/game-results';
import { MainScreen } from '@/components/main-screen';

export const AppContent = memo(() => {
  const {
    state,
    loadProgress,
    gameResults,
    error,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
  } = useAppContent();

  if (error) {
    return <AppError error={error} />;
  }

  switch (state) {
    case 'main':
      return <MainScreen onStartGame={startGame} />;
    case 'loading':
      return <AppLoading progress={loadProgress} />;
    default:
      return (
        <>
          <GameBar
            isVisible={state === 'playing' || state === 'fortuneWheel'}
            onClose={leaveGame}
          />

          <FortuneWheel
            isVisible={state === 'fortuneWheel'}
            onCollectBonus={collectBonus}
          />

          <GameResults
            isVisible={state === 'result'}
            gameResults={gameResults}
            onGoToMain={goToMain}
            onPlayAgain={playAgain}
          />
        </>
      );
  }
});
