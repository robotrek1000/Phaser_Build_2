import type { GameSessionResult } from '@/shared/api/finish-game-session';

export interface GameResultsProps {
  isVisible?: boolean;
  gameResults?: GameSessionResult;
  onGoToMain(): void;
  onPlayAgain(): void;
}
