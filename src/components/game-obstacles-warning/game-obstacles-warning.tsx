import type { FC } from 'react';

import styles from './game-obstacles-warning.module.css';

import type { GameObstaclesWarningProps } from './game-obstacles-warning.types';

import {
  LEVELS_CONFIG,
  OBSTACLES,
} from '@/components/game-obstacles-warning/game-obstacles-warning.constants';
import { useGameSettings } from '@/hooks/use-game-settings';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SecondaryButton } from '@/shared/components/secondary-button';

export const GameObstaclesWarning: FC<GameObstaclesWarningProps> = ({
  isVisible,
  onConfirm,
}) => {
  const { gameSettings } = useGameSettings();

  const levelsConfig = LEVELS_CONFIG[gameSettings.level];

  return (
    <SailorModal
      isOpen={isVisible}
      variant="blue"
      topGradient="red"
      sailorType="lookingFarOrange"
      className={styles.modalWindow}
      footer={
        <SecondaryButton className={styles.gotItBtn} onClick={onConfirm}>
          Понятно
        </SecondaryButton>
      }
      onClose={onConfirm}
    >
      <div className={styles.title}>
        Избегайте
        <br />
        препятствий
      </div>

      <div className={styles.obstacleList}>
        {OBSTACLES.map((obstacleType) => {
          const config = levelsConfig[obstacleType];

          return (
            <div key={obstacleType} className={styles.obstacle}>
              <div className={styles.obstacleIconContainer}>
                <img className={styles.obstacleIcon} src={config.img} alt="" />
              </div>
              {config.description}
            </div>
          );
        })}
      </div>
    </SailorModal>
  );
};
