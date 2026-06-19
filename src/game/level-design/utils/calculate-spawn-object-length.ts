import type { ClientLevelNumber } from '@/shared/types';

interface CalculateSpawnObjectLengthArgs {
  height: number | Record<ClientLevelNumber, number>;
  fallSpeedPxPerKmh: number;
  level: ClientLevelNumber;
}

export const calculateSpawnObjectLength = ({
  height,
  level,
  fallSpeedPxPerKmh,
}: CalculateSpawnObjectLengthArgs) => {
  const spawnObjectHeight = typeof height === 'number' ? height : height[level];

  return (spawnObjectHeight * fallSpeedPxPerKmh) / 1000;
};
