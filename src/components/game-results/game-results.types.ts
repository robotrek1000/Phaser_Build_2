import type { GameFinishPayload } from '@/game/game.types';

export interface GameResultsProps {
  isVisible?: boolean;
  gameResults?: GameFinishPayload;
  onGoToMain(): void;
  onPlayAgain(): void;
}
