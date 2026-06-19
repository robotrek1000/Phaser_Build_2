import type { YachtBlinkAnimationConfig } from './yacht.types';
import type { ApplyRectHitboxConfig } from '@/game/utils';
import type { ClientYachtType } from '@/shared/types';

import { ASSET_KEYS } from '@/game/asset-keys.config';

const textures: Record<ClientYachtType, string> = {
  Normal: ASSET_KEYS.yacht.normal,
  Gold: ASSET_KEYS.yacht.gold,
};

const movingLerp = {
  normal: 0.09,
  fastSteeringWheel: 0.15,
  whirlpoolDebuff: 0.04,
};

const bodySizeRatio: ApplyRectHitboxConfig = {
  widthRatio: 1,
  heightRatio: 0.9,
};

export const YACHT_CONFIG = {
  depth: 14,
  verticalInsetRatio: 1 / 6,
  width: 46.754,
  height: 148.298,
  textures,
  movingLerp,
  bodySizeRatio,
} as const;

const introAnimation = {
  yRatio: 0.66,
  duration: 1800,
  ease: 'Sine.easeOut',
} as const;

const energyShieldActionAnimation: YachtBlinkAnimationConfig = {
  tintColor: 0xad6cff,
  alphaMin: 0.58,
  duration: 90,
  tintStrength: 0.72,
};

const damageHitAnimation: YachtBlinkAnimationConfig = {
  tintColor: 0xff3a3a,
  alphaMin: 0.58,
  duration: 90,
  tintStrength: 1,
};

const greenBuoyHitAnimation: YachtBlinkAnimationConfig = {
  tintColor: 0x57ff58,
  alphaMin: 0.72,
  duration: 90,
  tintStrength: 1,
};

const deathPreLiftAnimation = {
  y: 72,
  duration: 220,
  ease: 'Sine.easeOut',
} as const;

const deathRotationAnimation = {
  turns: 2.2,
  duration: 900,
  ease: 'Sine.easeIn',
} as const;

const deathFallAnimation = {
  offscreenExtraPx: 24,
  duration: 900,
  ease: 'Sine.easeIn',
} as const;

const whirlpoolAnimation = {
  rotation: Math.PI * 2,
  duration: 1000,
  ease: 'Sine.ease',
  repeat: -1,
} as const;

const increaseTierAnimation = {
  duration: 600,
  ease: 'Sine.ease',
} as const;

const bonusCatchAnimation = {
  offsetPx: 160,
  duration: 270,
  returnDuration: 720,
  ease: 'Sine.easeOut',
} as const;

export const YACHT_ANIMATIONS_CONFIG = {
  intro: introAnimation,
  energyShieldAction: energyShieldActionAnimation,
  damageHit: damageHitAnimation,
  greenBuoyHit: greenBuoyHitAnimation,
  greenBuoyHitDuration: 300,
  deathPreLift: deathPreLiftAnimation,
  deathRotation: deathRotationAnimation,
  deathFall: deathFallAnimation,
  whirlpool: whirlpoolAnimation,
  increaseTier: increaseTierAnimation,
  bonusCatch: bonusCatchAnimation,
} as const;

export const SHADOW_CONFIG = {
  x: 1,
  y: 1,
  decay: 0.2,
  power: 1,
  color: 0x000000,
  samples: 6,
  intensity: 0.2,
} as const;
