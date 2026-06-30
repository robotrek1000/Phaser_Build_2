import type { InternalAxiosRequestConfig } from 'axios';

import { sessionStore } from '@/shared/api/session-store';

export const accessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = sessionStore.getAccessToken();

  if (token) {
    config?.headers?.set('Authorization', `Bearer ${token}`);
  }

  return config;
};
