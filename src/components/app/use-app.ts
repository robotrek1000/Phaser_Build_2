import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ExitConfirmationContextProps } from '@/contexts/exit-confirmation-context';

import { Game } from '@/game';

export const useApp = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [game, setGame] = useState<Game>();

  const [isExitConfirmationVisible, setIsExitConfirmationVisible] =
    useState(false);

  const handleExitConfirmationShow = useCallback(() => {
    setIsExitConfirmationVisible(true);
  }, []);

  const handleExitConfirmationHide = useCallback(() => {
    setIsExitConfirmationVisible(false);
  }, []);

  const exitConfirmationContextValue =
    useMemo<ExitConfirmationContextProps>(() => {
      return {
        isVisible: isExitConfirmationVisible,
        show: handleExitConfirmationShow,
        hide: handleExitConfirmationHide,
      };
    }, [
      handleExitConfirmationHide,
      handleExitConfirmationShow,
      isExitConfirmationVisible,
    ]);

  const hideSplashScreen = useCallback(() => {
    const gameCanvas = containerRef.current?.querySelector('canvas');
    const splashScreen = document.getElementById('app-splash-screen');

    if (gameCanvas) {
      gameCanvas.style.opacity = '1';
      splashScreen?.remove();
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const game = new Game(containerRef.current);

    const refreshGameView = () => {
      game.refreshView();
    };

    window.addEventListener('resize', refreshGameView);
    window.addEventListener('orientationchange', refreshGameView);
    window.visualViewport?.addEventListener('resize', refreshGameView);
    window.visualViewport?.addEventListener('scroll', refreshGameView);

    setGame(game);

    game.load();

    return () => {
      game.destroy();

      window.removeEventListener('resize', refreshGameView);
      window.removeEventListener('orientationchange', refreshGameView);
      window.visualViewport?.removeEventListener('resize', refreshGameView);
      window.visualViewport?.removeEventListener('scroll', refreshGameView);
    };
  }, []);

  return {
    containerRef,
    game,
    exitConfirmationContextValue,
    hideSplashScreen,
  };
};
