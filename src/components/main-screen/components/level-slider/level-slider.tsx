import { type FC } from 'react';

import { LEVELS_CONFIG } from './level-slider.constants';
import styles from './level-slider.module.css';

import type { LevelSliderProps } from './level-slider.types';

import { useLevelSlider } from '@/components/main-screen/components/level-slider/use-level-slider';
import { Slider } from '@/shared/components/slider';
import { SliderPagination } from '@/shared/components/slider-pagination';
import { TextArt } from '@/shared/components/text-art';

export const LevelSlider: FC<LevelSliderProps> = (props) => {
  const { levels, activeSlideIndex, currentLevel, handleSlideChange } =
    useLevelSlider(props);

  return (
    <div className={props.className}>
      <div className={styles.container}>
        <Slider
          slideClassName={styles.slide}
          slides={levels.map(({ number }) => (
            <img
              className={styles.levelImg}
              src={LEVELS_CONFIG[number].bg}
              alt=""
            />
          ))}
          activeSlideIndex={activeSlideIndex}
          onSlideChange={handleSlideChange}
        />

        <div className={styles.content}>{props.children}</div>

        <TextArt
          className={styles.textArt}
          title={currentLevel.title}
          subtitle={`${currentLevel.number} уровень`}
        />
      </div>

      <SliderPagination
        className={styles.pagination}
        count={levels.length}
        active={activeSlideIndex}
      />
    </div>
  );
};
