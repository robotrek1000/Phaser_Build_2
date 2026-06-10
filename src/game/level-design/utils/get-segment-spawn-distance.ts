import type { SegmentWithId } from '../types';

export const getSegmentSpawnDistance = (
  start: number,
  segmentList: SegmentWithId[],
  segmentIndex: number
): number => {
  return segmentList
    .slice(0, segmentIndex)
    .reduce((acc, { lengthMeters }) => acc + lengthMeters, start);
};
