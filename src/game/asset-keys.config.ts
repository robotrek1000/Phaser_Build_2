export const ASSETS_PACK_NAME = 'game-assets';

export const ASSET_KEYS = {
  bonuses: {
    energy: 'energy-bonus',
    coin: 'coin',
    timeBonus: 'time-bonus',
  },
  ui: {
    skillWheelBarBody: 'skill-wheel-bar-body',
    skillWheelArrow: 'skill-wheel-arrow',
    skillWheelSector_1: 'skill-wheel-sector-1',
  },
} as const;

export const NEW_ASSET_KEYS = {
  yacht: {
    normal: 'yacht-normal',
    gold: 'yacht-gold',
  },
  common: {
    energy: 'energy-new',
    timeBonus: 'time-bonus-new',
    moneyDown: 'money-down-new',
    moneyUp: 'money-up-new',
    moneyChangeDown: 'money-change-down-new',
    moneyChangeNo: 'money-change-no-new',
    moneyChangeUp: 'money-change-up-new',
  },
  shadows: {
    energy: 'energy-shadow',
    timeBonus: 'bonus-time-shadow',
  },
  level1: {
    waterBackground: 'sea-lvl-1',
    harbor: 'harbor-lvl-1',
    island: 'island-lvl-1',
    solidObstacle: 'solid-obstacle-lvl-1',
    whirlpool: 'whirlpool-lvl-1',
  },
  level2: {
    waterBackground: 'sea-lvl-2',
    harbor: 'harbor-lvl-2',
    island: 'island-lvl-2',
    solidObstacle: 'solid-obstacle-lvl-2',
    whirlpool: 'whirlpool-lvl-2',
  },
  level3: {
    waterBackground: 'sea-lvl-3',
    harbor: 'harbor-lvl-3',
    island: 'island-lvl-3',
    solidObstacle: 'solid-obstacle-lvl-3',
    whirlpool: 'whirlpool-lvl-3',
  },
} as const;
