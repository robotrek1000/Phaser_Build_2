import type { Rule } from './how-to-play-guide.types';

import buoys from '@/assets/onboarding_1_buoys.webp';
import energy from '@/assets/onboarding_2_energy.webp';
import coinXL from '@/assets/onboarding_3_coin.webp';
import clock from '@/assets/onboarding_4_time.webp';

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
