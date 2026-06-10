export const ENERGY_SHIELD_CONFIG = {
  radiusPx: 135,
  thicknessPx: 38,
  innerColor: 0x78e3ff,
  outerColor: 0x8b4dff,
  innerAlpha: 0.08,
  outerAlpha: 0.95,
  gradientSteps: 16,
  yOffsetPx: 0,
  depth: 9,
  scale: 0.72,
  bounce: [1, 1],
  immovable: true,
} as const;

export const ENERGY_SHIELD_SHOW_ANIMATION = {
  alpha: 0.78,
  scaleX: 1,
  scaleY: 1,
  duration: 220,
  ease: 'Sine.easeOut',
} as const;

export const ENERGY_SHIELD_HIDE_ANIMATION = {
  alpha: 0,
  scaleX: 0.9,
  scaleY: 0.9,
  duration: 180,
  ease: 'Sine.easeIn',
} as const;
