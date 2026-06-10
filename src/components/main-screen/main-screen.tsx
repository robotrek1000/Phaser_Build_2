import type { FC } from 'react';

import { Boosters } from './components/boosters';
import { LevelSlider } from './components/level-slider';
import { YachtSkinDisplay } from './components/yacht-skin-display';
import { BACKGROUND } from './main-screen.constants';
import styles from './main-screen.module.css';

import type { MainScreenProps } from '@/components/main-screen/main-screen.types';

import closedLock from '@/assets/lock-closed.svg';
import { HowToPlayGuide } from '@/components/how-to-play-guide';
import { CoinsBalance } from '@/components/main-screen/components/coins-balance';
import { useMainScreen } from '@/components/main-screen/use-main-screen';
import { IconButton } from '@/components/shared/components/icon-button';
import { PrimaryButton } from '@/components/shared/components/primary-button';
import { SecondaryButton } from '@/components/shared/components/secondary-button';
import { Separator } from '@/components/shared/components/separator';
import { useExitConfirmation } from '@/contexts/exit-confirmation-context';
import { cn } from '@/utils';

export const MainScreen: FC<MainScreenProps> = ({ onStartGame }) => {
  const { show: showExitConfirmation } = useExitConfirmation();

  const {
    level,
    isLevelAvailable,
    boostersState,
    isHowToPlayGuideVisible,
    isGoldSkin,
    showHowToPlayGuide,
    hideHowToPlayGuide,
    handleLevelChange,
    handleBoosterClick,
    toggleSkin,
  } = useMainScreen();

  return (
    <>
      <div className={cn(styles.container, BACKGROUND[level])}>
        <div className={styles.topBar}>
          <CoinsBalance amount={400} />

          <SecondaryButton
            className={styles.howToPlayBtn}
            size="s"
            onClick={showHowToPlayGuide}
          >
            как играть
          </SecondaryButton>

          <IconButton icon="settings" />

          <IconButton icon="exit" onClick={showExitConfirmation} />
        </div>

        <button className={styles.yachtSkinsBtn} onClick={toggleSkin}>
          Скины
        </button>

        <LevelSlider
          className={styles.levelSlider}
          level={level}
          onLevelChange={handleLevelChange}
        >
          <div className={styles.yachtSkinDisplayContainer}>
            <YachtSkinDisplay isGold={isGoldSkin} />
          </div>
        </LevelSlider>

        <Separator className={styles.separator} />

        <div className={styles.boostersTitle}>Улучшения</div>

        <Boosters
          className={styles.boosters}
          boostersState={boostersState}
          onBoosterClick={handleBoosterClick}
        />

        <div className={styles.bottomBar}>
          <PrimaryButton
            // disabled={!isLevelAvailable}
            className={styles.playBtn}
            onClick={onStartGame}
          >
            {isLevelAvailable && 'играть'}

            {!isLevelAvailable && (
              <span className={styles.playBtnContent}>
                <img className={styles.playBtnIcon} src={closedLock} alt="" />

                <span>Уровень закрыт</span>
              </span>
            )}
          </PrimaryButton>

          {level > 1 && (
            <div className={styles.bottomBarInfoText}>
              Чтобы открыть пройдите уровень {level - 1}
            </div>
          )}
        </div>
      </div>

      <HowToPlayGuide
        isVisible={isHowToPlayGuideVisible}
        onConfirm={hideHowToPlayGuide}
      />
    </>
  );
};
