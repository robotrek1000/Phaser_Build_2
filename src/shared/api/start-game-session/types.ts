import type { ClientLevelNumber } from '@/shared/types';

export interface StartGameSessionRequest {
  levelId: ClientLevelNumber;
  isFreeStart: boolean;
}

export interface StartGameSessionResponse {
  sessionId: string;
}
