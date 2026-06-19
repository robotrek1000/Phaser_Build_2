import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { ANIMATION_CONFIG } from './backdrop.constants';
import styles from './backdrop.module.css';

import type { BackdropProps } from './backdrop.types';

export const Backdrop: FC<BackdropProps> = ({ isVisible, onClick }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...ANIMATION_CONFIG}
          className={styles.backdrop}
          onClick={() => onClick?.()}
        />
      )}
    </AnimatePresence>
  );
};
