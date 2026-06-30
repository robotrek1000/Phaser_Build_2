import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy } from 'react';

import styles from './app.module.css';
import { useApp } from './use-app';

import { AppContent } from '@/components/app-content';
import { AppErrorContext } from '@/contexts/app-error-context';
import { ExitConfirmationContext } from '@/contexts/exit-confirmation-context';
import { GameContext } from '@/contexts/game-context';

const AppError = lazy(() => import('@/components/app-error'));
const AppExitConfirmation = lazy(
  () => import('@/components/app-exit-confirmation')
);

const queryClient = new QueryClient();

export const App = () => {
  const {
    containerRef,
    game,
    appErrorContextValue,
    exitConfirmationContextValue,
    hideSplashScreen,
  } = useApp();

  return (
    <div className={styles.container} ref={containerRef}>
      <AppErrorContext.Provider value={appErrorContextValue}>
        <ExitConfirmationContext.Provider value={exitConfirmationContextValue}>
          <GameContext.Provider value={game}>
            <QueryClientProvider client={queryClient}>
              <div className={styles.gameOverlay}>
                {game && <AppContent onContentReady={hideSplashScreen} />}

                <AppError />

                <AppExitConfirmation />
              </div>
            </QueryClientProvider>
          </GameContext.Provider>
        </ExitConfirmationContext.Provider>
      </AppErrorContext.Provider>
    </div>
  );
};
