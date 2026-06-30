import { Utils } from 'phaser';

import type { Segment, SegmentWithId } from '../types';

export const addIdToSegment = (segment: Segment): SegmentWithId => {
  return { id: Utils.String.UUID(), ...segment };
};
