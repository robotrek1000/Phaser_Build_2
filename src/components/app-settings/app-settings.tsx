import type { FC } from 'react';

import styles from './app-settings.module.css';

import type { AppSettingsProps } from './app-settings.types';

import { useAppSettings } from '@/components/app-settings/use-app-settings';
import { MusicIcon, SoundIcon } from '@/shared/components/icons';
import { PrimaryButton } from '@/shared/components/primary-button';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SwitchField } from '@/shared/components/switch-field';

export const AppSettings: FC<AppSettingsProps> = ({
  isVisible,
  onClose,
  onRateButtonClick,
}) => {
  const { musicEnabled, soundEnabled, handleToggleMusic, handleToggleSound } =
    useAppSettings();

  return (
    <SailorModal
      isOpen={isVisible}
      variant="gray"
      topGradient="gray"
      sailorType="repair"
      footer={
        <PrimaryButton className={styles.rateBtn} onClick={onRateButtonClick}>
          Оценить игру
        </PrimaryButton>
      }
      onClose={onClose}
    >
      <div className={styles.title}>Настройки</div>

      <div className={styles.controls}>
        <div className={styles.control}>
          <div className={styles.controlLabel}>
            <MusicIcon className={styles.controlIcon} />
            Музыка
          </div>

          <SwitchField
            defaultValue={musicEnabled}
            onChange={handleToggleMusic}
          />
        </div>

        <div className={styles.control}>
          <div className={styles.controlLabel}>
            <SoundIcon className={styles.controlIcon} />
            Звук
          </div>

          <SwitchField
            defaultValue={soundEnabled}
            onChange={handleToggleSound}
          />
        </div>
      </div>
    </SailorModal>
  );
};
