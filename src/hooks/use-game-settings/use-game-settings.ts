import { useEffect, useState } from 'react';

import type { GameSettings } from '@/game/level-design';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_UPDATE_SETTINGS } from '@/game';

export const useGameSettings = () => {
  const game = useGame();

  if (!game) {
    throw new Error('Game is not defined');
  }

  const [gameSettings, setGameSettings] = useState<GameSettings>(
    game.getSettings()
  );

  const updateGameSettings = (settings: Partial<GameSettings>) => {
    game.updateSettings(settings);
  };

  useEffect(() => {
    game.on(GAME_EVENT_UPDATE_SETTINGS, (value) => {
      setGameSettings(value as GameSettings);
    });
  }, [game]);

  return {
    gameSettings,
    updateGameSettings,
  };
};
