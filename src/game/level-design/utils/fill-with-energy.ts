import * as Phaser from 'phaser';

import type { Range, SpawnObjectConfig } from '../types';

export const fillWithEnergy = (
  unfilledIntervals: Range[],
  amount: number
): SpawnObjectConfig[] => {
  if (amount <= 0 || unfilledIntervals.length === 0) {
    return [];
  }

  const result: SpawnObjectConfig[] = [];
  const intervalsShortfall =
    unfilledIntervals.length > amount ? 0 : amount - unfilledIntervals.length;
  const energyPerInterval = Math.ceil(
    1 + intervalsShortfall / unfilledIntervals.length
  );
  const xInterval = 1 / energyPerInterval;
  const sortedUnfilledIntervals = [...unfilledIntervals].sort(
    (a, b) => b[1] - b[0] - (a[1] - a[0])
  );
  let cursor = 0;

  while (result.length < amount) {
    const [start, end] = sortedUnfilledIntervals[cursor];
    const intervalLength = (end - start) / energyPerInterval;
    const energyArray = Array.from({
      length: energyPerInterval,
    })
      .map<SpawnObjectConfig>((_, index) => {
        return {
          type: 'energy',
          xRatio: Phaser.Math.FloatBetween(
            xInterval * index,
            xInterval * index + xInterval
          ),
          spawnDistance:
            start +
            Phaser.Math.FloatBetween(
              0,
              intervalLength * index + intervalLength
            ),
        };
      })
      .slice(0, amount - result.length);

    result.push(...energyArray);

    cursor += 1;
  }

  return result;
};
