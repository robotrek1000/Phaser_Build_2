import { SESSION_RESPONSE } from './mock';

import type {
  StartGameSessionRequest,
  StartGameSessionResponse,
} from './types';

import { delay } from '@/utils';

export const startGameSession = async (
  _request: StartGameSessionRequest
): Promise<StartGameSessionResponse> => {
  await delay(300);

  return SESSION_RESPONSE;
};
