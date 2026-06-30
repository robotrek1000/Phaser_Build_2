import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { ANIMATION_CONFIG } from './app-error.constants';
import styles from './app-error.module.css';

import { useAppError } from '@/contexts/app-error-context';
import { useExitConfirmation } from '@/contexts/exit-confirmation-context';
import { IconButton } from '@/shared/components/icon-button';
import { SailorPicture } from '@/shared/components/sailor-picture';
import { SecondaryButton } from '@/shared/components/secondary-button';

export const AppError: FC = () => {
  const { isVisible, refresh } = useAppError();

  const { show: showExitConfirmation } = useExitConfirmation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div {...ANIMATION_CONFIG} className={styles.container}>
          <div className={styles.topBar}>
            <IconButton
              className={styles.exitBtn}
              icon="exit"
              onClick={showExitConfirmation}
            />
          </div>

          <SailorPicture variant="repair" />

          <div className={styles.description}>
            Ой, произошла
            <br />
            ошибка!
            <br />
            Обновите страницу
          </div>

          <div className={styles.bottomBar}>
            <SecondaryButton className={styles.refreshBtn} onClick={refresh}>
              Обновить
            </SecondaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
