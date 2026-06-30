import { type FC, lazy, Suspense } from 'react';

import { Boosters } from './components/boosters';
import { LevelSlider } from './components/level-slider';
import { YachtSkinDisplay } from './components/yacht-skin-display';
import { BACKGROUND } from './main-screen.constants';
import styles from './main-screen.module.css';

import type { MainScreenProps } from '@/components/main-screen/main-screen.types';

import { CoinsBalance } from '@/components/main-screen/components/coins-balance';
import { useMainScreen } from '@/components/main-screen/use-main-screen';
import { useExitConfirmation } from '@/contexts/exit-confirmation-context';
import { Hr } from '@/shared/components/hr';
import { IconButton } from '@/shared/components/icon-button';
import { LockIcon, RightArrowIcon } from '@/shared/components/icons';
import { PrimaryButton } from '@/shared/components/primary-button';
import { SecondaryButton } from '@/shared/components/secondary-button';
import { cn } from '@/utils';

const Feedback = lazy(() => import('@/components/feedback'));
const HowToPlayGuide = lazy(() => import('@/components/how-to-play-guide'));
const YachtSkinSelect = lazy(() => import('@/components/yacht-skin-select'));
const AppSettings = lazy(() => import('@/components/app-settings'));

export const MainScreen: FC<MainScreenProps> = (props) => {
  const { show: showExitConfirmation } = useExitConfirmation();

  const {
    level,
    isLevelAvailable,
    isHowToPlayGuideVisible,
    isYachtSkinSelectVisible,
    isSettingsVisible,
    isFeedbackVisible,
    showHowToPlayGuide,
    hideHowToPlayGuide,
    showYachtSkinSelect,
    hideYachtSkinSelect,
    handleLevelChange,
    showSettings,
    hideSettings,
    showFeedback,
    hideFeedback,
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

          <IconButton icon="settings" onClick={showSettings} />

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

        <Hr className={styles.separator} />

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

      <Suspense>
        <HowToPlayGuide
          isVisible={isHowToPlayGuideVisible}
          onConfirm={hideHowToPlayGuide}
        />

        <YachtSkinSelect
          key={JSON.stringify(isYachtSkinSelectVisible)}
          isVisible={isYachtSkinSelectVisible}
          onClose={hideYachtSkinSelect}
        />

        <AppSettings
          isVisible={isSettingsVisible}
          onClose={hideSettings}
          onRateButtonClick={showFeedback}
        />

        <Feedback isVisible={isFeedbackVisible} onClose={hideFeedback} />
      </Suspense>
    </>
  );
};
