import type {
  Segment,
  SegmentLengthMeters,
  SegmentObjectConfig,
} from '../types';
import type { SpawnObjectType } from '@/game/game.types';

export const createSegment = (
  weight: number,
  lengthMeters: SegmentLengthMeters,
  objectList: SegmentObjectConfig[]
): Segment => ({
  weight,
  lengthMeters,
  objectList,
});

const makeObject =
  (type: SpawnObjectType) =>
  (
    meterOffset: number,
    xRatio: number,
    xOffsetPx = 0
  ): SegmentObjectConfig => ({
    type,
    meterOffset,
    xRatio,
    xOffsetPx,
  });

export const moneyUp = makeObject('moneyUp');
export const moneyDown = makeObject('moneyDown');
export const moneyDownMagnet = makeObject('moneyDownMagnet');
export const dynamicBuoy = makeObject('dynamicBuoy');
export const whirlpool = makeObject('whirlpool');
export const reef = makeObject('reef');
export const wheelIsland = makeObject('wheelIsland');
