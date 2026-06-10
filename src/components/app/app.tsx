import styles from './app.module.css';
import { useApp } from './use-app';

import { AppContent } from '@/components/app-content';
import { AppExitConfirmation } from '@/components/app-exit-confirmation';
import { ExitConfirmationContext } from '@/contexts/exit-confirmation-context';
import { GameContext } from '@/contexts/game-context';

export const App = () => {
  const { containerRef, game, exitConfirmationContextValue } = useApp();

  return (
    <div className={styles.container} ref={containerRef}>
      <ExitConfirmationContext.Provider value={exitConfirmationContextValue}>
        <GameContext.Provider value={game}>
          <div className={styles.gameOverlay}>
            <AppContent />

            <AppExitConfirmation />
          </div>
        </GameContext.Provider>
      </ExitConfirmationContext.Provider>
    </div>
  );
};
