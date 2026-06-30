import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import {
  CONTAINER_BACKGROUND,
  MODAL_WINDOW_ANIMATION_CONFIG,
  TOP_GRADIENT,
} from './modal-window.constants';
import styles from './modal-window.module.css';

import type { ModalWindowProps } from './modal-window.types';

import { Backdrop } from '@/shared/components/backdrop';
import { ColoredEllipseBackground } from '@/shared/components/colored-ellipse-background';
import { IconButton } from '@/shared/components/icon-button';
import { cn } from '@/utils';

export const ModalWindow: FC<ModalWindowProps> = ({
  className,
  isOpen,
  hasBackdrop = true,
  variant = 'blue',
  topGradient = 'blue',
  children,
  footer,
  onClose,
}) => {
  return (
    <>
      {hasBackdrop && <Backdrop isVisible={isOpen} onClick={onClose} />}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...MODAL_WINDOW_ANIMATION_CONFIG}
            className={cn(
              className,
              styles.modalWindow,
              CONTAINER_BACKGROUND[variant]
            )}
          >
            <ColoredEllipseBackground
              className={styles.topGradient}
              {...TOP_GRADIENT[topGradient]}
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
    </>
  );
};
