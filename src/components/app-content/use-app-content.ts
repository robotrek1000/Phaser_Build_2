import { useEffect, useRef, useState } from 'react';

import type {
  Boosters,
  GameStartAnimationState,
  State,
} from './app-content.types';
import type {
  GameFinishPayload,
  GameplayEvent,
  GameStateUpdatePayload,
} from '@/game/game.types';
import type { GameSettings } from '@/game/level-design';
import type { ScreenIlluminationType } from '@/shared/components/screen-illumination';
import type { ClientProfile } from '@/shared/types';

import { YACHT_IMPROVEMENT_TO_BOOSTER_MAP } from '@/components/app-content/app-content.constants';
import { useGame } from '@/contexts/game-context';
import {
  DEFAULT_GAME_SETTINGS,
  GAME_EVENT_FINISH,
  GAME_EVENT_GAMEPLAY_EVENT,
  GAME_EVENT_LOAD_FINISH,
  GAME_EVENT_LOAD_PROGRESS,
  GAME_EVENT_REACH_ISLAND,
  type SkillWheelBonus,
} from '@/game';
import { useClientProfile } from '@/hooks/use-client-profile';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useFinishGameSession } from '@/hooks/use-finish-game-session';
import { useStartGameSession } from '@/hooks/use-start-game-session';
import { useUpdateClientSettings } from '@/hooks/use-update-client-settings';

const getInitialGameSettings = ({
  yachts,
  yachtImprovements,
}: ClientProfile): GameSettings => {
  const gameSettings: Partial<GameSettings> = {
    yachtSkin: yachts.find(({ isSelected }) => isSelected)?.type,
    ...yachtImprovements.reduce<Partial<Boosters>>(
      (acc, { type, isReceived }) => ({
        ...acc,
        [YACHT_IMPROVEMENT_TO_BOOSTER_MAP[type]]: isReceived,
      }),
      {}
    ),
  };

  return {
    ...DEFAULT_GAME_SETTINGS,
    ...gameSettings,
  };
};

export const useAppContent = () => {
  const { data: clientProfileData } = useClientProfile();

  const isTutorialCompleted = clientProfileData?.settings.tutorialComplete;

  const isClientProfileLoaded = Boolean(clientProfileData);

  const game = useGame();

  const [state, setState] = useState<State>('loading');

  const [loadProgress, setLoadProgress] = useState(0);

  const [gameProgress, setGameProgress] = useState<GameStateUpdatePayload>();

  const [isGameLoaded, setIsGameLoaded] = useState(false);

  const isGameLoadedDebounced = useDebouncedValue(isGameLoaded, 500);

  const [isGameOnboardingVisible, setIsGameOnboardingVisible] = useState(false);

  const [gameStartAnimationState, setGameStartAnimationState] =
    useState<GameStartAnimationState>('hidden');

  const [screenIllumination, setScreenIllumination] =
    useState<ScreenIlluminationType>();

  const { updateClientSettings } = useUpdateClientSettings();

  const closeGameOnboarding = () => {
    setIsGameOnboardingVisible(false);
    game?.resume();
    setGameStartAnimationState('playing');
    updateClientSettings({ tutorialComplete: true });
  };

  const handleSuccessGameSessionStart = () => {
    if (!game) {
      return;
    }

    game.soundManager.setState('game');
    game.start();
    setGameStartAnimationState('playing');
    setState('playing');

    if (!isTutorialCompleted) {
      setGameStartAnimationState('paused');
      game.pause();
      setIsGameOnboardingVisible(true);
    }
  };

  const { startGameSession, isPending: isGamePending } = useStartGameSession(
    handleSuccessGameSessionStart
  );

  const { finishGameSession, data: gameResults } = useFinishGameSession();

  const initializedRef = useRef(false);

  const hideGameStartAnimation = () => {
    setGameStartAnimationState('hidden');
  };

  const hideScreenIllumination = () => {
    setScreenIllumination(undefined);
  };

  const startGame = () => {
    if (!game) {
      throw new Error('Game is not defined');
    }

    startGameSession(true);
  };

  const goToMain = () => {
    setState('main');
    game?.soundManager.setState('interface');
  };

  const playAgain = () => {
    startGame();
  };

  const leaveGame = () => {
    game?.stop();
    game?.soundManager.setState('interface');

    setState('main');
  };
  const collectBonus = (bonus: SkillWheelBonus) => {
    game?.collectBonus(bonus);
    setState('playing');
  };

  useEffect(() => {
    if (!game) {
      return;
    }

    const unsubscribeFromLoadProgress = game.on(
      GAME_EVENT_LOAD_PROGRESS,
      (value) => {
        setLoadProgress(value as number);
      }
    );

    const unsubscribeFromLoadFinish = game.on(GAME_EVENT_LOAD_FINISH, () => {
      setIsGameLoaded(true);
    });

    const unsubscribeFromReachIsland = game.on(
      GAME_EVENT_REACH_ISLAND,
      (payload) => {
        setState('bonusWheel');
        setGameProgress(payload as GameStateUpdatePayload);
      }
    );

    const unsubscribeFromFinish = game.on(GAME_EVENT_FINISH, (value) => {
      const gameSessionId = game.getSessionId();

      if (!gameSessionId) {
        throw new Error('sessionId is not defined');
      }

      const gameResults = value as GameFinishPayload;

      finishGameSession({
        sessionId: gameSessionId,
        coinsEventsQty: gameResults.coins,
        distanceCovered: gameResults.distance,
      });
      setState('result');
    });

    return () => {
      unsubscribeFromLoadProgress();
      unsubscribeFromLoadFinish();
      unsubscribeFromReachIsland();
      unsubscribeFromFinish();
    };
  }, [finishGameSession, game]);

  useEffect(() => {
    if (isGameLoadedDebounced && isClientProfileLoaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState('main');
      game?.soundManager.setState('interface');
    }
  }, [game?.soundManager, isClientProfileLoaded, isGameLoadedDebounced]);

  useEffect(() => {
    if (
      !game ||
      initializedRef.current ||
      !clientProfileData ||
      !isGameLoaded
    ) {

    game.setSettings(getInitialGameSettings(clientProfileData));
    game.soundManager.applySettings({
      isMusicEnabled: clientProfileData.settings.musicEnabled,
      isSoundEnabled: clientProfileData.settings.soundEnabled,
    });

    initializedRef.current = true;
  }, [clientProfileData, game]);

  useEffect(() => {
    if (!game) {
      return;
    }

    const unsubscribeFromGameplayEvent = game.on(
      GAME_EVENT_GAMEPLAY_EVENT,
      (value) => {
        switch (value as GameplayEvent) {
          case 'moneyDown':
            setScreenIllumination('damage');
            break;
        }
      }
    );

    return () => {
      unsubscribeFromGameplayEvent();
    };
  }, [game]);

  return {
    state: state,
    isGamePending,
    // уменьшаем для ленивой загрузки MainScreen
    loadProgress: !isClientProfileLoaded
      ? Math.max(loadProgress - 0.1, 0)
      : loadProgress - 0.01,
    gameProgress,
    gameResults,
    isGameOnboardingVisible,
    isGameStartAnimationVisible: ['playing', 'paused'].includes(
      gameStartAnimationState
    ),
    isGameStartAnimationPaused: gameStartAnimationState === 'paused',
    screenIllumination,
    startGame,
    goToMain,
    playAgain,
    leaveGame,
    collectBonus,
    closeGameOnboarding,
    hideGameStartAnimation,
    hideScreenIllumination,
  };
};
