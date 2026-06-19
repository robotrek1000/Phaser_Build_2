import { AnimatePresence, motion } from 'motion/react';
import { type FC, Fragment } from 'react';

import {
  IMG_ANIMATION_CONFIG,
  LEVELS_CONFIG,
  SLIDE_DRAG_CONFIG,
  TEXT_ART_ANIMATION_CONFIG,
} from './level-slider.constants';
import styles from './level-slider.module.css';

import type { LevelSliderProps } from './level-slider.types';

import { useLevelSlider } from '@/components/main-screen/components/level-slider/use-level-slider';
import { SliderPagination } from '@/shared/components/slider-pagination';
import { TextArt } from '@/shared/components/text-art';

export const LevelSlider: FC<LevelSliderProps> = (props) => {
  const { levels, handleSlideDragEnd } = useLevelSlider(props);

  return (
    <div className={props.className}>
      <motion.div
        className={styles.slide}
        {...SLIDE_DRAG_CONFIG}
        onDragEnd={handleSlideDragEnd}
      >
        <div className={styles.content}>{props.children}</div>

        <AnimatePresence>
          {levels.map(
            ({ number: lvl, title }) =>
              Number(lvl) === props.level && (
                <Fragment key={lvl}>
                  <motion.img
                    {...IMG_ANIMATION_CONFIG}
                    key={`${lvl}-img`}
                    className={styles.levelImg}
                    src={LEVELS_CONFIG[lvl].bg}
                    alt=""
                  />

                  <motion.div key={`${lvl}-txt`} {...TEXT_ART_ANIMATION_CONFIG}>
                    <TextArt
                      className={styles.textArt}
                      title={title}
                      subtitle={`${lvl} уровень`}
                    />
                  </motion.div>
                </Fragment>
              )
          )}
        </AnimatePresence>
      </motion.div>

      <SliderPagination
        className={styles.pagination}
        count={3}
        active={props.level - 1}
      />
    </div>
  );
};
