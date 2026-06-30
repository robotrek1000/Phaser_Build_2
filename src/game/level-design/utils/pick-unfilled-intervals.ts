import { Utils } from 'phaser';

import type { Range } from '../types';

const isValidSet = (intervals: Range[], minGap: number): boolean => {
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);

  for (let i = 1; i < sorted.length; i++) {
    const [, prevEnd] = sorted[i - 1];
    const [curStart] = sorted[i];

    // пересечение
    if (curStart < prevEnd) {
      return false;
    }

    // нет минимального зазора
    if (curStart - prevEnd < minGap) {
      return false;
    }
  }

  return true;
};

export const pickUnfilledIntervals = ({
  source,
  count,
  bounds,
  minGap,
  maxAttempts = 1_000,
}: {
  source: Range[];
  count: number;
  bounds: Range;
  minGap: number;
  maxAttempts?: number;
}) => {
  const [globalStart, globalEnd] = bounds;

  const filtered = source.filter(
    ([s, e]) => s >= globalStart && e <= globalEnd
  );

  if (filtered.length === 0) {
    return [];
  }

  let bestSet: Range[] = [];

  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    const shuffled = Utils.Array.Shuffle(filtered);
    const picked: Range[] = [];

    for (const interval of shuffled) {
      if (picked.length === 0) {
        picked.push(interval);
      } else {
        const candidateSet = [...picked, interval];

        if (isValidSet(candidateSet, minGap)) {
          picked.push(interval);
        }
      }
      if (picked.length === count) break;
    }

    // если этот набор лучше (длиннее) — запоминаем
    if (picked.length > bestSet.length) {
      bestSet = picked;

      // если уже набрали максимально возможное — можно завершить
      if (bestSet.length === count) {
        break;
      }
    }
  }

  return bestSet;
};
