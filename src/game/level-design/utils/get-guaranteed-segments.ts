import type { SegmentWithId } from '../types';

export const getGuaranteedSegments = (
  segments: SegmentWithId[]
): SegmentWithId[] => segments.filter(({ weight }) => weight === 1);
