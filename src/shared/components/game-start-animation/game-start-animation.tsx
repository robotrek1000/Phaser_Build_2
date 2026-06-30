import type { FC } from 'react';

import { ScreenIllumination } from '../screen-illumination/screen-illumination';

import styles from './game-start-animation.module.css';

import type { ScreenIlluminationProps } from '@/shared/components/screen-illumination';

import { SailorPicture } from '@/shared/components/sailor-picture';
import { TextArt } from '@/shared/components/text-art';
import { cn } from '@/utils';

export const GameStartAnimation: FC<
  Omit<ScreenIlluminationProps, 'illumination'>
> = (props) => {
  return (
    <>
      <ScreenIllumination {...props} illumination="gameStart" />

      <div className={styles.container}>
        <div className={cn(styles.content, props.isPaused && styles.paused)}>
          <SailorPicture variant="lookingFar" />

          <TextArt className={styles.textArt} title="ВПЕРЕД!" />
        </div>
      </div>
    </>
  );
};
