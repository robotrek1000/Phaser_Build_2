export const ENERGY_CONFIG = {
  min: 0,
  max: 1,
  upValuePerStep: 0.025,
  downValuePerSec: 0.125,
  downValuePerSecForReinforceShield: 0.075,
} as const;

export const ASSETS_CONFIG = {
  profitPerAsset: 0.05,
  lossPerAsset: 0.25,
} as const;

export const INVULNERABILITY_TIMER_MILLISECONDS = 1800;

export const SOLID_COLLISION_CONFIG = {
  durationMilliseconds: 1_250,
  dropKmh: 15,
  decelKmhPerSec: 45,
  recoverKmhPerSec: 30,
} as const;

export const WHIRLPOOL_COLLISION_CONFIG = {
  durationMilliseconds: 5_000,
} as const;
