import { DESIGN_HEIGHT, DESIGN_WIDTH } from '@/constants';

export const setBaseCssVariables = () => {
  document.documentElement.style.setProperty(
    '--design-width',
    `${DESIGN_WIDTH}px`
  );

  document.documentElement.style.setProperty(
    '--design-height',
    `${DESIGN_HEIGHT}px`
  );
};
