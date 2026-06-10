import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import {
  CONTAINER_BACKGROUND,
  BACKDROP_ANIMATION_CONFIG,
  SAILOR,
  TOP_GRADIENT,
  MODAL_WINDOW_ANIMATION_CONFIG,
} from './modal-window.constants';
import styles from './modal-window.module.css';

import type { ModalWindowProps } from './modal-window.types';

import { IconButton } from '@/components/shared/components/icon-button';
import { cn } from '@/utils';

export const ModalWindow: FC<ModalWindowProps> = ({
  className,
  isOpen,
  variant = 'blue',
  topGradient = 'blue',
  sailorType = 'normal',
  children,
  footer,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...BACKDROP_ANIMATION_CONFIG}
          key="backdor"
          className={styles.backdrop}
          onClick={() => onClose?.()}
        />
      )}

      {isOpen && (
        <motion.div
          {...MODAL_WINDOW_ANIMATION_CONFIG}
          key="modal-window"
          className={cn(
            className,
            styles.modalWindow,
            CONTAINER_BACKGROUND[variant],
            TOP_GRADIENT[topGradient]
          )}
        >
          <img
            src={SAILOR[sailorType]}
            alt="Sailor"
            className={styles.sailorImg}
          />

          {onClose && (
            <IconButton
              icon="close"
              className={styles.closeBtn}
              onClick={onClose}
            />
          )}

          <div className={styles.content}>{children}</div>

          <div className={styles.footer}>{footer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
