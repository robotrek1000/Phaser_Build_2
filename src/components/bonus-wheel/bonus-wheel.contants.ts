import type { BonusConfig } from './bonus-wheel.types';
import type {
  SkillWheelDisplayedBonuses,
  SkillWheelFixedBonuses,
} from '@/game/system/game-state';

import coinXL from '@/assets/wheel_1.webp';
import buoys from '@/assets/wheel_2.webp';
import clock from '@/assets/wheel_3.webp';
import energy from '@/assets/wheel_4.webp';
import { FIXED_BONUSES } from '@/game';

export const BONUSES_CONFIG: BonusConfig[] = [
  {
    type: 'coins',
    img: coinXL,
    bgColor: '#2BA2FF',
    size: 1,
    description: 'Здесь всё просто :)',
    getValueDescription: () =>
      `Получи + ${FIXED_BONUSES.coins} монет в гавани!`,
  },
  {
    type: 'assets',
    img: buoys,
    bgColor: '#F3F52C',
    size: 1,
    description: 'Шкала активов заполняется быстрее!',
    getValueDescription: (value) =>
      `Стоимость собранных активов увеличивается x${value}.`,
  },
  {
    type: 'time',
    img: clock,
    bgColor: '#6DCB4B',
    size: 1,
    description: 'Легче добраться до гавани.',
    getValueDescription: (value) =>
      `Бонус временни дает дополнительно ${value} секунд`,
  },
  {
    type: 'energy',
    img: energy,
    bgColor: '#A84FF6',
    size: 1,
    description: 'Щит активов становится доступным быстрее!',
    getValueDescription: (value) =>
      `Собранная энергия даёт в ${value} раза больше энергии!`,
  },
];

export const MULTIPLIABLE_BONUSES_TYPES: SkillWheelDisplayedBonuses[] = [
  'assets',
  'energy',
];

export const FIXED_BONUSES_TYPES: SkillWheelFixedBonuses[] = ['time', 'coins'];
