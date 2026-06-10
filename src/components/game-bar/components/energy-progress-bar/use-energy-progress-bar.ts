import { useEffect, useState } from 'react';

import type { GameStateUpdatePayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_GAME_STATE_UPDATE } from '@/game';

export const useEnergyProgressBar = () => {
  const game = useGame();

  const [energy, setEnergy] = useState(0.5);

  useEffect(() => {
    if (game) {
      const unsubscribeGameStateUpdate = game.on(
        GAME_EVENT_GAME_STATE_UPDATE,
        (payload) => {
          const { energy } = payload as GameStateUpdatePayload;

          setEnergy(energy);
        }
      );

      return () => {
        unsubscribeGameStateUpdate();
      };
    }
  }, [game]);

  return {
    progress: energy,
  };
};
