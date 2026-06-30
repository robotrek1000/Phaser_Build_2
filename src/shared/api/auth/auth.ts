import type { AuthRequest } from './auth.types';

import { delay } from '@/utils';

export const auth = async ({ seamlessToken, fingerPrint }: AuthRequest) => {
  console.log({ seamlessToken, fingerPrint });

  await delay(300);

  return true;

  /*const refreshToken = sessionStore.getRefreshToken();

  if (!seamlessToken && !fingerPrint && !refreshToken) {
    throw new Error('Missing seamless_token or fingerprint in URL parameters');
  }

  const clientId = getRuntimeString('authClientId');

  if (!clientId) {
    throw new Error('Auth client id is not configured');
  }

  if (!seamlessToken && !fingerPrint && refreshToken) {
    await refreshAccessToken({ refreshToken, clientId });

    return true;
  }

  if (seamlessToken && fingerPrint) {
    await exchangeSeamlessToken({ clientId, seamlessToken, fingerPrint });

    return true;
  }

  throw new Error('Missing seamless_token or fingerprint in URL parameters');*/
};
