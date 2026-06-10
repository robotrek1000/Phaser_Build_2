import { BASE_REM, DESIGN_HEIGHT, DESIGN_WIDTH } from '@/constants';

export const syncAppViewportHeight = () => {
  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  const rem = BASE_REM * scale;

  document.documentElement.style.setProperty(
    '--app-height',
    `${Math.round(height)}px`
  );

  document.documentElement.style.setProperty('--game-rem', `${rem}px`);
};
