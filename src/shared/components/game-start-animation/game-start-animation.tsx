import type { CSSProperties, FC } from 'react';

import { ScreenIllumination } from '../screen-illumination/screen-illumination';

import { GAME_START_ANIMATION_CONFIG } from './game-start-animation.config';
import styles from './game-start-animation.module.css';

import type { ScreenIlluminationProps } from '@/shared/components/screen-illumination';

import { SailorPicture } from '@/shared/components/sailor-picture';
import { TextArt } from '@/shared/components/text-art';
import { cn } from '@/utils';

type AnimationStyle = CSSProperties & Record<`--${string}`, string | number>;

const contentAnimationStyle = {
  '--game-start-duration': `${GAME_START_ANIMATION_CONFIG.durationMs}ms`,
  '--game-start-easing': GAME_START_ANIMATION_CONFIG.easing,
  '--game-start-content-start-scale':
    GAME_START_ANIMATION_CONFIG.content.startScale,
  '--game-start-content-visible-scale':
    GAME_START_ANIMATION_CONFIG.content.visibleScale,
  '--game-start-content-fade-out-scale':
    GAME_START_ANIMATION_CONFIG.content.fadeOutScale,
  '--game-start-content-end-scale': GAME_START_ANIMATION_CONFIG.content.endScale,
} as AnimationStyle;

const illuminationAnimationStyle = {
  '--game-start-duration': `${GAME_START_ANIMATION_CONFIG.durationMs}ms`,
  '--game-start-easing': GAME_START_ANIMATION_CONFIG.easing,
  '--game-start-illumination-start-scale':
    GAME_START_ANIMATION_CONFIG.illumination.startScale,
  '--game-start-illumination-visible-scale':
    GAME_START_ANIMATION_CONFIG.illumination.visibleScale,
  '--game-start-illumination-fade-out-scale':
    GAME_START_ANIMATION_CONFIG.illumination.fadeOutScale,
  '--game-start-illumination-end-scale':
    GAME_START_ANIMATION_CONFIG.illumination.endScale,
} as AnimationStyle;

export const GameStartAnimation: FC<
  Omit<ScreenIlluminationProps, 'illumination'>
> = (props) => {
  return (
    <>
      <ScreenIllumination
        {...props}
        className={props.className}
        style={illuminationAnimationStyle}
        illumination="gameStart"
      />

      <div className={styles.container}>
        <div
          className={cn(styles.content, props.isPaused && styles.paused)}
          style={contentAnimationStyle}
        >
          <SailorPicture variant="lookingFar" />

          <TextArt className={styles.textArt} title="ВПЕРЕД!" />
        </div>
      </div>
    </>
  );
};
