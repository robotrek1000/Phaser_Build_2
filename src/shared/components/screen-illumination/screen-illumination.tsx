import type { FC } from 'react';

import { ILLUMINATION_CONFIG } from './screen-illumination.config';
import styles from './screen-illumination.module.css';
import { useScreenIllumination } from './use-screen-illumination';

import type { ScreenIlluminationProps } from './screen-illumination.types';

import { cn } from '@/utils';

export const ScreenIllumination: FC<ScreenIlluminationProps> = (props) => {
  const { handleAnimationEnd } = useScreenIllumination(props);

  return (
    <div
      className={cn(
        props.className,
        styles.container,
        props.isPaused && styles.paused,
        ILLUMINATION_CONFIG[props.illumination]
      )}
      onAnimationEnd={handleAnimationEnd}
    />
  );
};
