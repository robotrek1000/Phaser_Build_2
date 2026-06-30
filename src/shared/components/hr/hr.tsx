import type { FC } from 'react';

import styles from './hr.module.css';

import type { HrProps } from './hr.types';

import { cn } from '@/utils';

export const Hr: FC<HrProps> = ({ className }) => {
  return (
    <div className={cn(className, styles.container)}>
      <svg
        className={styles.svg}
        viewBox="0 0 200 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          opacity="0.3"
          x1="1"
          y1="1"
          x2="199"
          y2="1"
          stroke="url(#paint0_linear_6104_7659)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6104_7659"
            x1="0"
            y1="2.5"
            x2="200"
            y2="2.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.5" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
