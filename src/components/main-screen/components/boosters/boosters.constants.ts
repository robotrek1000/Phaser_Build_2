import type { BoosterConfig } from './boosters.types';
import type { ClientYachtImprovementType } from '@/shared/types';

import boosterEngine from '@/assets/booster_1.png';
import boosterBody from '@/assets/booster_2.png';
import boosterSteeringWheel from '@/assets/booster_3.png';
import boosterShield from '@/assets/booster_4.png';

export const BOOSTERS_CONFIG: Record<
  ClientYachtImprovementType,
  BoosterConfig
> = {
  Frame: {
    img: boosterBody,
    modalProps: {
      variant: 'green',
      topGradient: 'brightGreen',
    },
  },
  Engine: {
    img: boosterEngine,
    modalProps: {
      variant: 'darkBlue',
      topGradient: 'brightBlue',
    },
  },
  Shield: {
    img: boosterShield,
    modalProps: {
      variant: 'violet',
      topGradient: 'violet',
    },
  },
  Wheel: {
    img: boosterSteeringWheel,
    modalProps: {
      variant: 'gold',
      topGradient: 'yellow',
    },
  },
};

export const BOOSTERS_ORDER: ClientYachtImprovementType[] = [
  'Engine',
  'Frame',
  'Wheel',
  'Shield',
];
