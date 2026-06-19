import type { ClientCurrencies, ClientPaidAttemptPrice } from '@/shared/types';

export type GameSessionResultType = 'Bad' | 'Normal' | 'Good';

export interface FinishGameSessionRequest {
  sessionId: string;
  distanceCovered: number;
  coinsEventsQty: number;
}

export interface FinishGameSessionResponse {
  sessionResult: GameSessionResult;
  attempts: GameSessionResultAttempts;
  currencies: ClientCurrencies;
}

export interface GameSessionResult {
  goldCoinsEarned: number;
  xpEarned: number;
  type: GameSessionResultType;
  description: string;
  goalDistance: number;
  distanceCovered: number;
}

export interface GameSessionResultAttempts {
  freeAttempts: number;
  attemptRefresh: string;
  paidAttemptIsAvailable: boolean;
  paidAttemptPrice: ClientPaidAttemptPrice;
}
