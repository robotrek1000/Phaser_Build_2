import type { SpawnGroupMap } from './spawn-manager.types';

import { DynamicBuoy } from '@/game/entities/dynamic-buoy';
import { Energy } from '@/game/entities/energy';
import { Harbor } from '@/game/entities/harbor';
import { MoneyDown } from '@/game/entities/money-down';
import { MoneyDownMagnet } from '@/game/entities/money-down-magnet';
import { MoneyUp } from '@/game/entities/money-up';
import { Reef } from '@/game/entities/reef';
import { TimeBonus } from '@/game/entities/time-bonus';
import { WheelIsland } from '@/game/entities/wheel-island';
import { Whirlpool } from '@/game/entities/whirlpool';

export const SPAWN_GROUP_MAP_CONFIG: Partial<SpawnGroupMap> = {
  moneyDown: MoneyDown,
  moneyDownMagnet: MoneyDownMagnet,
  dynamicBuoy: DynamicBuoy,
  whirlpool: Whirlpool,
  reef: Reef,
  moneyUp: MoneyUp,
  energy: Energy,
  timeBonus: TimeBonus,
  wheelIsland: WheelIsland,
  harbor: Harbor,
};
