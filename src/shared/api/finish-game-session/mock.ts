import type { FinishGameSessionResponse } from './finish-game-session.types';

export const SESSION_RESPONSE: FinishGameSessionResponse = {
  sessionResult: {
    goldCoinsEarned: 40,
    xpEarned: 10,
    type: 'Good',
    description: 'Вы допстигли бухты!',
    goalDistance: 2562,
    distanceCovered: 2562,
  },
  attempts: {
    freeAttempts: 1,
    attemptRefresh: '2026-06-25T01:00:00.000Z',
    paidAttemptIsAvailable: true,
    paidAttemptPrice: {
      goldCoins: 20,
      diamonds: 0,
    },
  },
  currencies: {
    goldCoins: 400,
    diamonds: 123,
  },
};
