import type { Rule } from './how-to-play-guide.types';

import buoys from '@/assets/buoys.png';
import clock from '@/assets/clock.png';
import coinXL from '@/assets/coin-xl.png';
import energy from '@/assets/energy.png';

export const RULES: Rule[] = [
  {
    key: 'buoys',
    icon: buoys,
    description: 'Собирайте  зеленые буйки и обходите красные',
  },
  {
    key: 'energy',
    icon: energy,
    description: 'Собирайте  энергию, чтобы активировать щит активов',
  },
  {
    key: 'coins',
    icon: coinXL,
    description:
      'Чем больше пройденное расстояние, тем больше монет вы получите',
  },
  {
    key: 'time-bonus',
    icon: clock,
    description:
      'Собирайте бонусы времени и следите за шкалой портфеля, чтобы достигнуть конца уровня',
  },
];
