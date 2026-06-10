import { useEffect, useState } from 'react';

import type { GameStateUpdatePayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_GAME_STATE_UPDATE } from '@/game';

export const useDistanceProgressBar = () => {
  const game = useGame();

  const [distance, setDistance] = useState(0);

  const [totalDistance, setTotalDistance] = useState(1);

  const progress = distance / totalDistance;

  useEffect(() => {
    if (game) {
      const unsubscribeGameStateUpdate = game.on(
        GAME_EVENT_GAME_STATE_UPDATE,
        (payload) => {
          const { distance, totalDistance } = payload as GameStateUpdatePayload;

          setDistance(distance);
          setTotalDistance(totalDistance);
        }
      );

      return () => {
        unsubscribeGameStateUpdate();
      };
    }
  }, [game]);

  return {
    progress,
  };
};
