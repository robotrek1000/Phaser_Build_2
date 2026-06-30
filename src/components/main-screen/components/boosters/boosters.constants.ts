import type { BoosterConfig } from './boosters.types';
import type { ClientYachtImprovementType } from '@/shared/types';

import boosterEngine from '@/assets/booster_1.webp';
import boosterEnginePreview from '@/assets/booster_1_mini.webp';
import boosterBody from '@/assets/booster_2.webp';
import boosterBodyPreview from '@/assets/booster_2_mini.webp';
import boosterSteeringWheel from '@/assets/booster_3.webp';
import boosterSteeringWheelPreview from '@/assets/booster_3_mini.webp';
import boosterShield from '@/assets/booster_4.webp';
import boosterShieldPreview from '@/assets/booster_4_mini.webp';

export const BOOSTERS_CONFIG: Record<
  ClientYachtImprovementType,
  BoosterConfig
> = {
  Frame: {
    fullImg: boosterBody,
    previewImg: boosterBodyPreview,
    modalProps: {
      variant: 'green',
      topGradient: 'brightGreen',
    },
  },
  Engine: {
    fullImg: boosterEngine,
    previewImg: boosterEnginePreview,
    modalProps: {
      variant: 'darkBlue',
      topGradient: 'brightBlue',
    },
  },
  Shield: {
    fullImg: boosterShield,
    previewImg: boosterShieldPreview,
    modalProps: {
      variant: 'violet',
      topGradient: 'violet',
    },
  },
  Wheel: {
    fullImg: boosterSteeringWheel,
    previewImg: boosterSteeringWheelPreview,
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
