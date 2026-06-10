import type { FC } from 'react';

import styles from './game-results.module.css';

import type { GameResultsProps } from './game-results.types';

import coin from '@/assets/coin.png';
import xp from '@/assets/xp.png';
import { useGameResults } from '@/components/game-results/use-game-results';
import { ModalWindow } from '@/components/shared/components/modal-window';
import { PrimaryButton } from '@/components/shared/components/primary-button';
import { SecondaryButton } from '@/components/shared/components/secondary-button';
import { Separator } from '@/components/shared/components/separator';
import { TextArt } from '@/components/shared/components/text-art';
import { cn } from '@/utils';

export const GameResults: FC<GameResultsProps> = (props) => {
  const {
    isWin,
    modalWindowProps,
    distance,
    totalDistance,
    distanceIcon,
    text,
  } = useGameResults(props);

  return (
    <ModalWindow
      {...modalWindowProps}
      isOpen={props.isVisible}
      className={styles.modalWindow}
      variant="blue"
      footer={
        <div className={styles.buttonsBar}>
          <SecondaryButton onClick={props.onGoToMain}>меню</SecondaryButton>

          <PrimaryButton className={styles.playBtn} onClick={props.onPlayAgain}>
            <span>Играть снова</span>

            <span className={styles.playCostContainer}>
              <span className={styles.playCostIcon}>
                <img src={coin} alt="Coins" />
              </span>

              <span className={styles.playCostText}>10</span>
            </span>
          </PrimaryButton>
        </div>
      }
    >
      <div>
        <img src={distanceIcon} alt="Icon" className={styles.distanceIcon} />

        <TextArt
          title={distance}
          titleClassName={cn(isWin && styles.winValue)}
          subtitle={`из ${totalDistance}`}
        />
      </div>

      <div className={styles.text}>{text}</div>

      <Separator className={styles.separator} />

      <div className={styles.rewardTitle}>Награда</div>

      <div className={styles.rewardsContainer}>
        <div className={styles.reward}>
          <img src={coin} alt="Coins" className={styles.rewardIcon} />

          <div>10</div>
        </div>

        <div className={styles.reward}>
          <img src={xp} alt="XP" className={styles.rewardIcon} />

          <div>10</div>
        </div>
      </div>
    </ModalWindow>
  );
};
