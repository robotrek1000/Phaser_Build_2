import type { FC } from 'react';

import { Boosters } from './components/boosters';
import { LevelSlider } from './components/level-slider';
import { YachtSkinDisplay } from './components/yacht-skin-display';
import { BACKGROUND } from './main-screen.constants';
import styles from './main-screen.module.css';

import type { MainScreenProps } from '@/components/main-screen/main-screen.types';

import { HowToPlayGuide } from '@/components/how-to-play-guide';
import { CoinsBalance } from '@/components/main-screen/components/coins-balance';
import { YachtSkinSelect } from '@/components/main-screen/components/yacht-skin-select';
import { useMainScreen } from '@/components/main-screen/use-main-screen';
import { useExitConfirmation } from '@/contexts/exit-confirmation-context';
import { IconButton } from '@/shared/components/icon-button';
import { LockIcon, RightArrowIcon } from '@/shared/components/icons';
import { PrimaryButton } from '@/shared/components/primary-button';
import { SecondaryButton } from '@/shared/components/secondary-button';
import { Separator } from '@/shared/components/separator';
import { cn } from '@/utils';

export const MainScreen: FC<MainScreenProps> = (props) => {
  const { show: showExitConfirmation } = useExitConfirmation();

  const {
    level,
    isLevelAvailable,
    isHowToPlayGuideVisible,
    isYachtSkinSelectVisible,
    showHowToPlayGuide,
    hideHowToPlayGuide,
    showYachtSkinSelect,
    hideYachtSkinSelect,
    handleLevelChange,
  } = useMainScreen(props);

  return (
    <>
      <div className={cn(styles.container, BACKGROUND[level])}>
        <div className={styles.topBar}>
          <CoinsBalance />

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

        <button className={styles.yachtSkinsBtn} onClick={showYachtSkinSelect}>
          Скины
          <RightArrowIcon className={styles.yachtSkinsBtnArrowIcon} />
        </button>

        <LevelSlider
          className={styles.levelSlider}
          level={level}
          onLevelChange={handleLevelChange}
        >
          <div className={styles.yachtSkinDisplayContainer}>
            <YachtSkinDisplay />
          </div>
        </LevelSlider>

        <Separator className={styles.separator} />

        <div className={styles.boostersTitle}>Улучшения</div>

        <Boosters className={styles.boosters} />

        <div className={styles.bottomBar}>
          <PrimaryButton
            // disabled={!isLevelAvailable}
            isPending={props.isGamePending}
            className={styles.playBtn}
            onClick={props.onStartGame}
          >
            {isLevelAvailable && 'играть'}

            {!isLevelAvailable && (
              <span className={styles.playBtnContent}>
                <LockIcon className={styles.playBtnIcon} />

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

      <YachtSkinSelect
        isVisible={isYachtSkinSelectVisible}
        onClose={hideYachtSkinSelect}
      />
    </>
  );
};
