import { Math as PhaserMath, Utils } from 'phaser';

import { addIdToSegment } from './add-id-to-segment';
import { getGuaranteedSegments } from './get-guaranteed-segments';
import { getGuaranteedSegmentsLength } from './get-guaranteed-segments-length';
import { getOptionalSegments } from './get-optional-segments';
import { getSegmentSpawnDistance } from './get-segment-spawn-distance';
import { getSpawnObjectConfig } from './get-spawn-object-config';

import type { Range, SegmentWithId, SpawnObjectConfig } from '../types';

export const generateGamePhaseObjects = (
  [start, end]: Range,
  segmentList: SegmentWithId[]
): SpawnObjectConfig[] => {
  const phaseLength = end - start;
  const guaranteedSegments = getGuaranteedSegments(segmentList);
  const optionalSegments = getOptionalSegments(segmentList);

  let remainingLength =
    phaseLength - getGuaranteedSegmentsLength(guaranteedSegments);
  const result = [...guaranteedSegments];

  while (remainingLength > 0) {
    let availableSegments = optionalSegments.filter(
      (optionalSegment) =>
        !result.some(
          (selectedSegment) => optionalSegment.id === selectedSegment.id
        )
    );

    if (
      (result[result.length - 1]?.lengthMeters === 50 &&
        result[result.length - 2]?.lengthMeters !== 50) ||
      remainingLength < 100
    ) {
      availableSegments = availableSegments.filter(
        ({ lengthMeters }) => lengthMeters === 50
      );
    }

    const segment =
      PhaserMath.RND.weightedPick(availableSegments) ??
      addIdToSegment({
        lengthMeters: 50,
        objectList: [],
        weight: 0,
      });

    result.push(segment);

    remainingLength -= segment.lengthMeters;
  }

  return Utils.Array.Shuffle(result)
    .flatMap((segment, index) =>
      getSpawnObjectConfig(
        segment,
        getSegmentSpawnDistance(start, result, index)
      )
    )
    .sort((a, b) => a.spawnDistance - b.spawnDistance);
};
