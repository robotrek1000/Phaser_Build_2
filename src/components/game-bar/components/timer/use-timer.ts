import { useEffect, useState } from 'react';

import type { GameStateUpdatePayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_GAME_STATE_UPDATE } from '@/game';

export const useTimer = () => {
  const game = useGame();

  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    if (game) {
      const unsubscribeGameStateUpdate = game.on(
        GAME_EVENT_GAME_STATE_UPDATE,
        (payload) => {
          const { timeLeft } = payload as GameStateUpdatePayload;

          const totalSeconds = Math.max(0, Math.ceil(timeLeft));
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;

          setTimeDisplay(
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        }
      );

      return () => {
        unsubscribeGameStateUpdate();
      };
    }
  }, [game]);

  return {
    timeDisplay,
  };
};
