import * as Phaser from 'phaser';

import type { Segment, SegmentWithId } from '../types';

export const addIdToSegment = (segment: Segment): SegmentWithId => {
  return { id: Phaser.Utils.String.UUID(), ...segment };
};
