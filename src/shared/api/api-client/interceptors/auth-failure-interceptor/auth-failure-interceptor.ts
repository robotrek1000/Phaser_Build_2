import type {
  FailedRequest,
  RetryableRequest,
} from './auth-failure-interceptor.types';
import type { AxiosError, AxiosInstance } from 'axios';

import { refreshAccessToken as refreshAccessTokenApiFn } from '@/shared/api/refresh-access-token';
import { sessionStore } from '@/shared/api/session-store';
import { getRuntimeString } from '@/utils';

let failedQueue: FailedRequest[] = [];

let isRefreshing = false;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = sessionStore.getRefreshToken();

  const clientId = getRuntimeString('authClientId');

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  if (!clientId) {
    throw new Error('Auth client id is not configured');
  }

  const data = await refreshAccessTokenApiFn({ refreshToken, clientId });

  if (!data?.access_token) {
    sessionStore.clear();

    throw new Error('Refresh token expired');
  }

  sessionStore.saveTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  return data.access_token;
};

const applyAuthHeader = (request: RetryableRequest, token: string) => {
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
  };
};

const processQueue = (
  client: AxiosInstance,
  error: unknown,
  token?: string
) => {
  failedQueue.forEach((req) => {
    if (error || !token) {
      req.reject(error);

      return;
    }

    applyAuthHeader(req.config, token);

    req.resolve(client(req.config));
  });

  failedQueue = [];
};

export const authFailureInterceptor = (client: AxiosInstance) => {
  return async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;
    const status = error.response?.status;

    if (
      !originalRequest ||
      (status !== 401 && status !== 403) ||
      originalRequest.isRetry
    ) {
      return Promise.reject(error);
    }

    originalRequest.isRetry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const token = await refreshAccessToken();

      processQueue(client, null, token);

      applyAuthHeader(originalRequest, token);

      return client(originalRequest);
    } catch (error) {
      processQueue(client, error);

      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  };
};
