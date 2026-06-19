import { useEffect, useState } from 'react';

import type { GameStateUpdatePayload } from '@/game/game.types';
import type { SkillWheelDisplayedBonusesValues } from '@/game/system/game-state';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_GAME_STATE_UPDATE } from '@/game';

export const useBonuses = () => {
  const game = useGame();

  const [bonuses, setBonuses] = useState<SkillWheelDisplayedBonusesValues>([]);

  useEffect(() => {
    if (game) {
      const unsubscribeGameStateUpdate = game.on(
        GAME_EVENT_GAME_STATE_UPDATE,
        (payload) => {
          const { bonuses } = payload as GameStateUpdatePayload;

          setBonuses((currentBonuses) => {
            if (JSON.stringify(bonuses) !== JSON.stringify(currentBonuses)) {
              return bonuses;
            }

            return currentBonuses;
          });
        }
      );

      return () => {
        unsubscribeGameStateUpdate();
      };
    }
  }, [game]);

  return { bonuses };
};
