import type { RewardsConfig } from '@/game/ui/skill-wheel-modal/skill-wheel-modal.types';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const OVERLAY_CONFIG = {
  enabled: true,
  color: 0x000000,
  alpha: 0.52,
  depth: 180,
} as const;

export const GLOW_CONFIG = {
  color: 0x65d8ff,
  alpha: 0.0,
} as const;

export const CONTAINER_CONFIG = {
  centerXRatio: 0.5,
  centerYRatio: 0.43,
  depth: OVERLAY_CONFIG.depth + 1,
} as const;

export const BAR_CONFIG = {
  baseTextureKey: ASSET_KEYS.ui.skillWheelBarBody,
  scale: 0.27,
  offsetX: 0,
  offsetY: -73,
  sectorsCount: 4,
} as const;

export const POINTER_CONFIG = {
  baseTextureKey: ASSET_KEYS.ui.skillWheelArrow,
  scale: 0.4,
  offsetX: 7,
  offsetY: 25,
  originX: 0.5,
  originY: 0.84,
  initialAngleDeg: -90,
  startTween: {
    angle: '+=180',
    duration: 600,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.ease',
  },
  endTween: {
    duration: 500,
    ease: 'Back.Out',
  },
} as const;

export const INTRO_TEXT_CONFIG = {
  text: 'ВЫБЕРИТЕ БОНУС',
  offsetY: 166,
  style: {
    fontFamily: 'Fascinate',
    fontSize: '30px',
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
  },
};

export const RESULT_ICON_CONFIG = {
  baseTextureKey: ASSET_KEYS.ui.skillWheelSector_1,
  offsetX: -21,
  offsetY: -58,
  maxWidth: 182,
  maxHeight: 134,
} as const;

export const RESULT_TITLE_CONFIG = {
  offsetX: 74,
  offsetY: -47,
  style: {
    fontFamily: 'Fascinate',
    fontSize: '28px ',
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
  },
} as const;

export const RESULT_BODY_CONFIG = {
  offsetY: 112,
  style: {
    fontFamily: 'Fascinate',
    fontSize: '24px ',
    color: '#ffffff',
    align: 'center',
  },
} as const;

export const CONTINUE_CONFIG = {
  text: 'НАЖМИТЕ ДЛЯ ПРОДОЛЖЕНИЯ',
  offsetY: 264,
  alpha: 0.68,
  style: {
    fontFamily: 'Fascinate',
    fontSize: '20px ',
    fontStyle: 'bold',
    color: '#ffffff',
    align: 'center',
  },
  tween: {
    alpha: 0.45,
    duration: 500,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1,
  },
} as const;

export const REWARDS_CONFIG: RewardsConfig = {
  1: {
    iconKey: ASSET_KEYS.bonuses.coin,
    title: '+10',
    bodyLine1: 'Получи + 10 монет в гавани!',
    bodyLine2: 'Здесь всё просто :)',
    bonus: 'coins',
  },
  2: {
    iconKey: ASSET_KEYS.ui.skillWheelSector_1,
    title: 'x2',
    bodyLine1: 'Стоимость собранных активов\nувеличивается x2.',
    bodyLine2: 'Шкала активов заполняется быстрее!',
    bonus: 'assets',
  },
  3: {
    iconKey: ASSET_KEYS.bonuses.timeBonus,
    title: 'x2',
    bodyLine1: 'Бонус времени даёт\nв 2 раза больше секунд.',
    bodyLine2: 'Легче добраться до гавани.',
    bonus: 'time',
  },
  4: {
    iconKey: ASSET_KEYS.bonuses.energy,
    title: 'x2',
    bodyLine1: 'Собранная энергия даёт\nв 2 раза больше энергии!',
    bodyLine2: 'Щит активов становится\nдоступным быстрее!',
    bonus: 'energy',
  },
};
