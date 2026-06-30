import type { AxiosRequestConfig } from 'axios';

export interface RetryableRequest extends AxiosRequestConfig {
  isRetry?: boolean;
}

export interface FailedRequest {
  config: RetryableRequest;
  resolve(value?: unknown): void;
  reject(reason?: unknown): void;
}
