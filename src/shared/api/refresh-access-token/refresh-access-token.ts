import type {
  RefreshAccessTokenRequest,
  RefreshAccessTokenResponse,
} from './refresh-access-token.types';

import { authClient } from '@/shared/api/auth-client/auth-client';

export const refreshAccessToken = async ({
  refreshToken,
  clientId,
}: RefreshAccessTokenRequest) => {
  const { data } = await authClient.post<RefreshAccessTokenResponse>(
    '/auth/realms/Broker/protocol/openid-connect/token',
    {
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return data;
};
