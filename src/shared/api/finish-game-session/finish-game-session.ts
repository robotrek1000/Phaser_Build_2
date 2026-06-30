import { SESSION_RESPONSE } from './mock';

import type {
  FinishGameSessionRequest,
  FinishGameSessionResponse,
} from './finish-game-session.types';

import { delay } from '@/utils';

export const finishGameSession = async (
  _request: FinishGameSessionRequest
): Promise<FinishGameSessionResponse> => {
  await delay(300);

  return SESSION_RESPONSE;
};
