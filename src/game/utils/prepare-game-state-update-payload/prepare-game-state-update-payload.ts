import type { GameStateUpdatePayload } from '@/game/game.types';

import { GameState } from '@/game/system/game-state';

export const prepareGameStateUpdatePayload = (
  gameState: GameState
): GameStateUpdatePayload => {
  return {
    distance: gameState.distanceProgress,
    totalDistance: gameState.totalDistance,
    assetsProgress: gameState.assetsProgress,
    assetsCapacity: gameState.assetsCapacity,
    energy: gameState.energyProgress,
    coins: gameState.coinsProgress,
    timeLeft: gameState.timer,
    yachtSkin: gameState.yachtSkin,
  };
};
