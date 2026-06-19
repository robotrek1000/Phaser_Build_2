import type { GameFinishPayload } from '@/game/game.types';

import { GameState } from '@/game/system/game-state';

export const prepareGameFinishPayload = (
  gameState: GameState
): GameFinishPayload => {
  return {
    isAtPort: gameState.isAtPort,
    distance: gameState.distanceProgress,
    totalDistance: gameState.totalDistance,
    assetsProgress: gameState.assetsProgress,
    assetsCapacity: gameState.assetsCapacity,
    coins: gameState.coinsProgress,
    timeLeft: gameState.timer,
    yachtSkin: gameState.yachtSkin,
    bonuses: gameState.skillWheelBonuses,
  };
};
