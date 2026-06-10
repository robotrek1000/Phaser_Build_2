import type { SegmentWithId, SpawnObjectConfig } from '../types';

export const getSpawnObjectConfig = (
  segment: SegmentWithId,
  segmentSpawnDistance: number
): SpawnObjectConfig[] => {
  return segment.objectList.map<SpawnObjectConfig>(
    ({ meterOffset, ...rest }) => ({
      ...rest,
      spawnDistance: segmentSpawnDistance + meterOffset,
    })
  );
};
