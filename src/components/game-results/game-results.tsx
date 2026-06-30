import type { FC } from 'react';

import styles from './game-results.module.css';

import type { GameResultsProps } from './game-results.types';

import coin from '@/assets/coin.webp';
import xp from '@/assets/xp.webp';
import { useGameResults } from '@/components/game-results/use-game-results';
import { Backdrop } from '@/shared/components/backdrop';
import { Hr } from '@/shared/components/hr';
import {
  CupIcon,
  FlagIcon,
  LaurelLeftIcon,
  LaurelRightIcon,
} from '@/shared/components/icons';
import { Loader } from '@/shared/components/loader';
import { PrimaryButton } from '@/shared/components/primary-button';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SecondaryButton } from '@/shared/components/secondary-button';
import { TextArt } from '@/shared/components/text-art';
import { cn } from '@/utils';

export const GameResults: FC<GameResultsProps> = (props) => {
  const { isWin, modalWindowProps } = useGameResults(props);

  return (
    <>
      <Backdrop isVisible={props.isVisible} />

      {props.isVisible && !props.gameResults && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}

      <SailorModal
        {...modalWindowProps}
        isOpen={props.isVisible && Boolean(props.gameResults)}
        className={styles.modalWindow}
        variant="blue"
        hasBackdrop={false}
        footer={
          <div className={styles.buttonsBar}>
            <SecondaryButton onClick={props.onGoToMain}>меню</SecondaryButton>

            <PrimaryButton
              className={styles.playBtn}
              onClick={props.onPlayAgain}
            >
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
        {props.gameResults && (
          <>
            <div className={styles.distanceContainer}>
              {isWin && <CupIcon className={styles.distanceIcon} />}

              {props.gameResults.type !== 'Good' && (
                <FlagIcon className={styles.distanceIcon} />
              )}

              <div className={styles.textArtContainer}>
                {isWin && (
                  <LaurelLeftIcon
                    className={cn(
                      styles.winValueLaurel,
                      styles.winValueLaurelLeft
                    )}
                  />
                )}

                <TextArt
                  title={props.gameResults.distanceCovered}
                  subtitle={`из ${props.gameResults.goalDistance}`}
                />

                {isWin && (
                  <LaurelRightIcon
                    className={cn(
                      styles.winValueLaurel,
                      styles.winValueLaurelRight
                    )}
                  />
                )}
              </div>
            </div>

            <div className={styles.text}>{props.gameResults.description}</div>

            <Hr className={styles.separator} />

            <div className={styles.rewardTitle}>Награда</div>

            <div className={styles.rewardsContainer}>
              <div className={styles.reward}>
                <img src={coin} alt="Coins" className={styles.rewardIcon} />

                <div>{props.gameResults.goldCoinsEarned}</div>
              </div>

              <div className={styles.reward}>
                <img src={xp} alt="XP" className={styles.rewardIcon} />

                <div>{props.gameResults.xpEarned}</div>
              </div>
            </div>
          </>
        )}
      </SailorModal>
    </>
  );
};
