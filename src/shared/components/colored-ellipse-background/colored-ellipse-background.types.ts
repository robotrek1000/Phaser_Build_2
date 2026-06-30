export type ColoredEllipseBackgroundSize = 'm' | 'l';

export interface ColoredEllipseBackgroundSizeConfig {
  viewBox: string;
  ellipse: {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
  };
  filter: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ColoredEllipseBackgroundProps {
  className?: string;
  size?: ColoredEllipseBackgroundSize;
  color?: string;
}
