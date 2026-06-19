import { getSpawnObjectLength } from './get-spawn-object-length';

import type { Range, SpawnObjectConfig } from '../types';
import type { ClientLevelNumber } from '@/shared/types';

const MIN_UNFILLED_INTERVAL_LENGTH = 2;

interface GetUnfilledIntervalsArgs {
  objects: SpawnObjectConfig[];
  fallSpeedPxPerKmh: number;
  level: ClientLevelNumber;
}

export const getUnfilledIntervals = ({
  objects,
  fallSpeedPxPerKmh,
  level,
}: GetUnfilledIntervalsArgs) => {
  const minGap = (MIN_UNFILLED_INTERVAL_LENGTH * 1000) / fallSpeedPxPerKmh;

  return objects.reduce<Range[]>((acc, current, index) => {
    if (!(index % 2)) {
      return acc;
    }

    const prev = objects[index - 1];

    const currentHalfLength =
      getSpawnObjectLength({
        spawnObjectConfig: current,
        fallSpeedPxPerKmh,
        level,
      }) / 2;
    const prevHalfLength =
      getSpawnObjectLength({
        spawnObjectConfig: prev,
        fallSpeedPxPerKmh,
        level,
      }) / 2;

    const gap =
      current.spawnDistance +
      currentHalfLength -
      prev.spawnDistance -
      prevHalfLength;

    if (gap < minGap) {
      return acc;
    }

    acc.push([prev.spawnDistance, current.spawnDistance]);

    return acc;
  }, []);
};
