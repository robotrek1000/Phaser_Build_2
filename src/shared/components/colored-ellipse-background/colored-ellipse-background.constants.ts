import type {
  ColoredEllipseBackgroundSize,
  ColoredEllipseBackgroundSizeConfig,
} from './colored-ellipse-background.types';

export const SIZE_CONFIG: Record<
  ColoredEllipseBackgroundSize,
  ColoredEllipseBackgroundSizeConfig
> = {
  l: {
    viewBox: '0 0 358 358',
    ellipse: {
      cx: 179,
      cy: 58,
      rx: 289,
      ry: 200,
    },
    filter: {
      x: -210,
      y: -242,
      width: 778,
      height: 600,
    },
  },
  m: {
    viewBox: '0 0 358 176',
    ellipse: {
      cx: 179,
      cy: -29.5,
      rx: 289,
      ry: 105.5,
    },
    filter: {
      x: -210,
      y: -235,
      width: 778,
      height: 411,
    },
  },
};
