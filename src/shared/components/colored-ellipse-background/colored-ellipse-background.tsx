import type { FC } from 'react';

import { SIZE_CONFIG } from './colored-ellipse-background.constants';

import type { ColoredEllipseBackgroundProps } from './colored-ellipse-background.types';

export const ColoredEllipseBackground: FC<ColoredEllipseBackgroundProps> = ({
  className,
  size = 'm',
  color,
}) => {
  const { viewBox, ellipse, filter } = SIZE_CONFIG[size];

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_5837_59814)">
        <ellipse {...ellipse} fill={color} />
      </g>
      <defs>
        <filter
          {...filter}
          id="filter0_f_5837_59814"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="50"
            result="effect1_foregroundBlur_5837_59814"
          />
        </filter>
      </defs>
    </svg>
  );
};
