import type { LevelId } from '@/game/level-design';

interface CalculateSpawnObjectLengthArgs {
  height: number | Record<LevelId, number>;
  fallSpeedPxPerKmh: number;
  level: LevelId;
}

export const calculateSpawnObjectLength = ({
  height,
  level,
  fallSpeedPxPerKmh,
}: CalculateSpawnObjectLengthArgs) => {
  const spawnObjectHeight = typeof height === 'number' ? height : height[level];

  return (spawnObjectHeight * fallSpeedPxPerKmh) / 1000;
};
