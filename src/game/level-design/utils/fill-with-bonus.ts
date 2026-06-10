import * as Phaser from 'phaser';

import { pickUnfilledIntervals } from './pick-unfilled-intervals';

import type { BonusesLevelConfig, Range, SpawnObjectConfig } from '../types';
import type { SpawnObjectType } from '@/game/game.types';

export const fillWithBonus = (
  type: SpawnObjectType,
  unfilledIntervals: Range[],
  { count, minGap, bounds }: BonusesLevelConfig
): SpawnObjectConfig[] => {
  return pickUnfilledIntervals({
    source: unfilledIntervals,
    bounds,
    count,
    minGap,
  }).map(([start, end]) => {
    return {
      type,
      xRatio: Phaser.Math.FloatBetween(0.2, 0.8),
      spawnDistance: Phaser.Math.FloatBetween(start, end),
    };
  });
};
