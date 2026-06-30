export const GAME_START_ANIMATION_CONFIG = {
  durationMs: 2200,
  easing: 'ease-in-out',
  content: {
    startScale: 1.35,
    visibleScale: 1.05,
    fadeOutScale: 0.9,
    endScale: 0.68,
  },
  illumination: {
    startScale: 1.08,
    visibleScale: 1,
    fadeOutScale: 0.94,
    endScale: 0.82,
  },
} as const;
