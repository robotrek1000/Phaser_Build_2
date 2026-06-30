import axios from 'axios';

import { accessTokenInterceptor } from './interceptors/access-token-interceptor';
import { authFailureInterceptor } from './interceptors/auth-failure-interceptor';

import { getRuntimeBoolean, getRuntimeString } from '@/utils';

export const apiClient = axios.create({
  baseURL: getRuntimeString('apiBaseUrl'),
  withCredentials: getRuntimeBoolean('apiWithCredentials', true),
});

apiClient.interceptors.request.use(accessTokenInterceptor);

apiClient.interceptors.response.use(
  undefined,
  authFailureInterceptor(apiClient)
);
