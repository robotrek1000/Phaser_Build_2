import { useEffect, useState } from 'react';

import type { State } from './app-content.types';
import type {
  GameFinishPayload,
  GameStateUpdatePayload,
} from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import {
  GAME_EVENT_FINISH,
  GAME_EVENT_LOAD_FINISH,
  GAME_EVENT_LOAD_PROGRESS,
  GAME_EVENT_REACH_ISLAND,
  type SkillWheelBonus,
} from '@/game';
import { useClientProfile } from '@/hooks/use-client-profile';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useFinishGameSession } from '@/hooks/use-finish-game-session';
import { useStartGameSession } from '@/hooks/use-start-game-session';

export const useAppContent = () => {
  const { data: clientProfileData } = useClientProfile();

  const isClientProfileLoaded = Boolean(clientProfileData);

  const game = useGame();

  const [state, setState] = useState<State>('loading');

  const [loadProgress, setLoadProgress] = useState(0);

  const [gameProgress, setGameProgress] = useState<GameStateUpdatePayload>();

  const [error, setError] = useState<unknown>();

  const [isGameLoaded, setIsGameLoaded] = useState(false);

  const isGameLoadedDebounced = useDebouncedValue(isGameLoaded, 500);

  const { startGameSession, isPending: isGamePending } = useStartGameSession(
    () => {
      game?.start();
      setState('playing');
    }
  );

  const {
    finishGameSession,
    data: gameResults,
    isPending: isGameResultsPending,
  } = useFinishGameSession();

  const startGame = () => {
    if (!game) {
      throw new Error('Game is not defined');
    }

    startGameSession(true);
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
      setIsGameLoaded(true);
    });

    game.on(GAME_EVENT_REACH_ISLAND, (payload) => {
      setState('bonusWheel');
      setGameProgress(payload as GameStateUpdatePayload);
    });

    game.on(GAME_EVENT_FINISH, (value) => {
      const gameSessionId = game.getSessionId();

      if (!gameSessionId) {
        throw new Error('sessionId is not defined');
      }

      const gameResults = value as GameFinishPayload;

      finishGameSession({
        sessionId: gameSessionId,
        coinsEventsQty: gameResults.coins,
        distanceCovered: gameResults.distance,
      });
      setState('result');
    });
  }, [finishGameSession, game]);

  const collectBonus = (bonus: SkillWheelBonus) => {
    game?.collectBonus(bonus);
    setState('playing');
  };

  useEffect(() => {
    if (isGameLoadedDebounced && isClientProfileLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState('main');
    }
  }, [isClientProfileLoaded, isGameLoadedDebounced]);

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
    state: state,
    isGamePending,
    loadProgress: !isClientProfileLoaded
      ? Math.max(loadProgress - 0.1, 0)
      : loadProgress - 0.01,
    gameProgress,
    gameResults,
    isGameResultsPending,
    error,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
  };
};
