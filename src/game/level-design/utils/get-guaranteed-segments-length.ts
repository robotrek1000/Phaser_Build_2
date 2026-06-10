import type { SegmentWithId } from '../types';

export const getGuaranteedSegmentsLength = (
  segments: SegmentWithId[]
): number => segments.reduce((acc, { lengthMeters }) => acc + lengthMeters, 0);
