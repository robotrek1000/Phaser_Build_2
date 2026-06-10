import type { SegmentWithId } from '../types';

export const getOptionalSegments = (
  segments: SegmentWithId[]
): SegmentWithId[] =>
  segments
    .filter(({ weight }) => weight < 1)
    .sort(({ weight: weightA }, { weight: weightB }) => weightB - weightA);
