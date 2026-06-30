import type {
  ExchangeSeamlessTokenRequest,
  ExchangeSeamlessTokenResponse,
} from './exchange-seamless-token.types';

import { authClient } from '@/shared/api/auth-client/auth-client';

export const exchangeSeamlessToken = async ({
  clientId,
  seamlessToken,
  fingerPrint,
}: ExchangeSeamlessTokenRequest) => {
  const { data } = await authClient.post<ExchangeSeamlessTokenResponse>(
    '/auth/realms/Broker/protocol/openid-connect/token',
    {
      grant_type: 'password',
      client_id: clientId,
      seamless_token: seamlessToken,
      finger_print: fingerPrint,
    },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return data;
};
