import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import styles from './app.module.css';
import { useApp } from './use-app';

import { AppContent } from '@/components/app-content';
import { AppExitConfirmation } from '@/components/app-exit-confirmation';
import { ExitConfirmationContext } from '@/contexts/exit-confirmation-context';
import { GameContext } from '@/contexts/game-context';

const queryClient = new QueryClient();

export const App = () => {
  const { containerRef, game, exitConfirmationContextValue, hideSplashScreen } =
    useApp();

  return (
    <div className={styles.container} ref={containerRef}>
      <ExitConfirmationContext.Provider value={exitConfirmationContextValue}>
        <GameContext.Provider value={game}>
          <QueryClientProvider client={queryClient}>
            <div className={styles.gameOverlay}>
              {game && <AppContent onContentReady={hideSplashScreen} />}

              <AppExitConfirmation />
            </div>
          </QueryClientProvider>
        </GameContext.Provider>
      </ExitConfirmationContext.Provider>
    </div>
  );
};
