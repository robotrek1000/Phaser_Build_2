import type { LevelId, SpawnObjectConfig } from '../types';
import type { SpawnObjectType } from '@/game/game.types';

import { DYNAMIC_BUOY_CONFIG } from '@/game/entities/dynamic-buoy/dynamic-buoy.config';
import { ENERGY_CONFIG } from '@/game/entities/energy/energy.config';
import { HARBOR_CONFIG } from '@/game/entities/harbor/harbor.config';
import { MONEY_DOWN_CONFIG } from '@/game/entities/money-down';
import { MONEY_UP_CONFIG } from '@/game/entities/money-up/money-up.config';
import { REEF_CONFIG } from '@/game/entities/reef/reef.config';
import { TIME_BONUS_CONFIG } from '@/game/entities/time-bonus/time-bonus.config';
import { WHEEL_ISLAND_CONFIG } from '@/game/entities/wheel-island/wheel-island.config';
import { WHIRLPOOL_CONFIG } from '@/game/entities/whirlpool/whirlpool.config';
import { calculateSpawnObjectLength } from '@/game/level-design/utils/calculate-spawn-object-length';

const spawnObjectHeights: Record<
  SpawnObjectType,
  number | Record<LevelId, number>
> = {
  dynamicBuoy: DYNAMIC_BUOY_CONFIG.height,
  energy: ENERGY_CONFIG.height,
  harbor: HARBOR_CONFIG.height,
  moneyDown: MONEY_DOWN_CONFIG.height,
  moneyDownMagnet: MONEY_DOWN_CONFIG.height,
  moneyUp: MONEY_UP_CONFIG.height,
  reef: REEF_CONFIG.height,
  timeBonus: TIME_BONUS_CONFIG.height,
  wheelIsland: WHEEL_ISLAND_CONFIG.height,
  whirlpool: WHIRLPOOL_CONFIG.height,
};

interface GetSpawnObjectLengthArgs {
  spawnObjectConfig: SpawnObjectConfig;
  fallSpeedPxPerKmh: number;
  level: LevelId;
}

export const getSpawnObjectLength = ({
  spawnObjectConfig: { type },
  fallSpeedPxPerKmh,
  level,
}: GetSpawnObjectLengthArgs): number => {
  return calculateSpawnObjectLength({
    height: spawnObjectHeights[type],
    level,
    fallSpeedPxPerKmh,
  });
};
