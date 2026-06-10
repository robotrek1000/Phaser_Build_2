import { GAME_PHASES_ORDER, HARBOR_SEGMENT } from '../config';

import { addIdToSegment } from './add-id-to-segment';
import { fillWithBonus } from './fill-with-bonus';
import { fillWithEnergy } from './fill-with-energy';
import { generateGamePhaseObjects } from './generate-game-phase-objects';
import { getUnfilledIntervals } from './get-unfilled-intervals';

import type {
  BonusesLevelConfig,
  GamePhase,
  LevelId,
  Range,
  SpawnObjectConfig,
  SpawnObjectsScenario,
} from '../types';

interface GenerateSpawnObjectsArgs {
  scenario: SpawnObjectsScenario;
  gamePhases: Record<GamePhase, Range>;
  energyAmount: number;
  timeBonuses: BonusesLevelConfig;
  levelDistance: number;
  level: LevelId;
  fallSpeedPxPerKmh: number;
}

export const generateSpawnObjects = ({
  scenario,
  gamePhases,
  energyAmount,
  timeBonuses,
  levelDistance,
  level,
  fallSpeedPxPerKmh,
}: GenerateSpawnObjectsArgs): SpawnObjectConfig[] => {
  const plannedObjects = GAME_PHASES_ORDER.flatMap((gamePhase) =>
    generateGamePhaseObjects(
      gamePhases[gamePhase],
      scenario[gamePhase].map(addIdToSegment)
    )
  ).sort((a, b) => a.spawnDistance - b.spawnDistance);
  const finalPhaseConfig: Range = [gamePhases.endgame[1], levelDistance];
  const finalObjects = generateGamePhaseObjects(finalPhaseConfig, [
    addIdToSegment(HARBOR_SEGMENT),
  ]);
  const unfilledIntervals = getUnfilledIntervals({
    objects: plannedObjects,
    level,
    fallSpeedPxPerKmh,
  });
  const energyObjects = fillWithEnergy(unfilledIntervals, energyAmount);
  const timeBonusObjects = fillWithBonus(
    'timeBonus',
    unfilledIntervals,
    timeBonuses
  );

  return [
    ...plannedObjects,
    ...finalObjects,
    ...energyObjects,
    ...timeBonusObjects,
  ].sort((a, b) => a.spawnDistance - b.spawnDistance);
};
