import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { AssetsProgressBar } from './components/assets-progress-bar';
import styles from './game-bar.module.css';
import { useGameBar } from './use-game-bar';

import type { GameBarProps } from '@/components/game-bar/game-bar.types';

import { DistanceProgressBar } from '@/components/game-bar/components/distance-progress-bar';
import { EnergyProgressBar } from '@/components/game-bar/components/energy-progress-bar';
import { ANIMATION_CONFIG } from '@/components/game-bar/game-bar.constants';
import { Timer } from '@/components/game-bar/timer';
import { ExitConfirmation } from '@/components/shared/components/exit-confirmation';
import { IconButton } from '@/components/shared/components/icon-button';
import { cn } from '@/utils';

export const GameBar: FC<GameBarProps> = ({ isVisible, onClose }) => {
  const { isExitConfirmationVisible, handleCloseClick, handleDeclineExit } =
    useGameBar();

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div {...ANIMATION_CONFIG} className={styles.container}>
            <div className={cn(styles.chip, styles.leftChip)}>
              <AssetsProgressBar />

              <EnergyProgressBar />
            </div>

            <div className={cn(styles.chip, styles.rightChip)}>
              <DistanceProgressBar className={styles.distanceProgress} />

              <Timer className={styles.timer} />
            </div>

            <IconButton
              icon="close"
              className={styles.closeBtn}
              onClick={handleCloseClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ExitConfirmation
        isVisible={isExitConfirmationVisible}
        onConfirm={onClose}
        onDecline={handleDeclineExit}
        onClose={handleDeclineExit}
      />
    </>
  );
};
