import { FINAL_PHASE_LENGTH, LEVEL_CONFIGS } from './config';
import { generateSpawnObjects } from './utils/generate-spawn-objects';

import type { GameSettings, Level } from './types';

export const prepareLevel = (gameSettings: GameSettings): Level => {
  const { scenario, gamePhases, timeBonuses, energyAmount, timer } =
    LEVEL_CONFIGS[gameSettings.level];

  const levelDistance = gamePhases.endgame[1] + FINAL_PHASE_LENGTH;

  const spawnObjectsScenario = generateSpawnObjects({
    scenario,
    gamePhases,
    timeBonuses,
    energyAmount,
    levelDistance,
    fallSpeedPxPerKmh: gameSettings.fallSpeedPxPerKmh,
    level: gameSettings.level,
  });

  return {
    gameSettings,
    timer,
    distance: levelDistance,
    spawnObjectsScenario,
  };
};
