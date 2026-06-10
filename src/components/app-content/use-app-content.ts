import { useEffect, useState } from 'react';

import type { State } from './app-content.types';
import type { RuntimeError } from '@/components/app-error';
import type { GameFinishPayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import {
  GAME_EVENT_FINISH,
  GAME_EVENT_LOAD_FINISH,
  GAME_EVENT_LOAD_PROGRESS,
  GAME_EVENT_REACH_ISLAND,
  type SkillWheelBonus,
} from '@/game';

export const useAppContent = () => {
  const game = useGame();

  const [state, setState] = useState<State>('loading');

  const [loadProgress, setLoadProgress] = useState(0);

  const [gameResults, setGameResults] = useState<GameFinishPayload>();

  const [error, setError] = useState<RuntimeError>();

  const startGame = () => {
    if (game) {
      game.start();
      setState('playing');
    } else {
      throw new Error('Game is not defined');
    }
  };

  const goToMain = () => {
    setState('main');
  };

  const playAgain = () => {
    startGame();
  };

  const leaveGame = () => {
    game?.stop();

    setState('main');
  };

  useEffect(() => {
    if (!game) {
      return;
    }

    game.on(GAME_EVENT_LOAD_PROGRESS, (value) => {
      setLoadProgress(value as number);
    });

    game.on(GAME_EVENT_LOAD_FINISH, () => {
      setState('main');
    });

    game.on(GAME_EVENT_REACH_ISLAND, () => {
      setState('fortuneWheel');
    });

    game.on(GAME_EVENT_FINISH, (value) => {
      setGameResults(value as GameFinishPayload);
      setState('result');
    });
  }, [game]);

  const collectBonus = (bonus: SkillWheelBonus) => {
    game?.collectBonus(bonus);
    setState('playing');
  };

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      setError({
        type: 'error',
        message: event.message || 'Unexpected window error',
        error: event.error,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      let message: string;

      if (reason instanceof Error) {
        message = reason.message;
      } else {
        message =
          typeof reason === 'string' ? reason : 'Unhandled promise rejection';
      }

      setError({
        type: 'unhandledrejection',
        message,
        error: reason,
      });
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  return {
    state,
    loadProgress,
    gameResults,
    error,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
  };
};
