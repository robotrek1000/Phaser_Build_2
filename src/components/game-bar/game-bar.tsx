import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { AssetsProgressBar } from './components/assets-progress-bar';
import styles from './game-bar.module.css';
import { useGameBar } from './use-game-bar';

import type { GameBarProps } from '@/components/game-bar/game-bar.types';

import { Bonuses } from '@/components/game-bar/components/bonuses';
import { DistanceProgressBar } from '@/components/game-bar/components/distance-progress-bar';
import { EnergyProgressBar } from '@/components/game-bar/components/energy-progress-bar';
import { Timer } from '@/components/game-bar/components/timer';
import { ANIMATION_CONFIG } from '@/components/game-bar/game-bar.constants';
import { ExitConfirmation } from '@/shared/components/exit-confirmation';
import { IconButton } from '@/shared/components/icon-button';

export const GameBar: FC<GameBarProps> = ({ isVisible, onClose }) => {
  const { isExitConfirmationVisible, handleCloseClick, handleDeclineExit } =
    useGameBar();

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div {...ANIMATION_CONFIG} className={styles.container}>
            <div className={styles.topBar}>
              <div className={styles.assetsAndEnergy}>
                <AssetsProgressBar />

                <EnergyProgressBar />
              </div>

              <div className={styles.distanceAndTimer}>
                <DistanceProgressBar className={styles.distanceProgressBar} />

                <Timer />
              </div>

              <IconButton
                icon="close"
                className={styles.closeBtn}
                onClick={handleCloseClick}
              />
            </div>

            <div className={styles.bottomBar}>
              <Bonuses />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExitConfirmation
        subtitle="Внимание! Вы потеряете попытку"
        isVisible={isExitConfirmationVisible}
        onConfirm={onClose}
        onDecline={handleDeclineExit}
        onClose={handleDeclineExit}
      />
    </>
  );
};
