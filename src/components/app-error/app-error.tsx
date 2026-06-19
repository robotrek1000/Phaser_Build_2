import type { FC } from 'react';

import styles from './app-error.module.css';

import { useAppError } from '@/components/app-error/use-app-error';
import { IconButton } from '@/shared/components/icon-button';
import { SailorPicture } from '@/shared/components/sailor-picture';
import { SecondaryButton } from '@/shared/components/secondary-button';

export const AppError: FC = () => {
  const { handleExitButtonClick, handleRefreshButtonClick } = useAppError();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <IconButton
          className={styles.exitBtn}
          icon="exit"
          onClick={handleExitButtonClick}
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
        <SecondaryButton
          className={styles.refreshBtn}
          onClick={handleRefreshButtonClick}
        >
          Обновить
        </SecondaryButton>
      </div>
    </div>
  );
};
