type RuntimeConfig = {
  apiBaseUrl?: string;
  apiWithCredentials?: boolean | string;
  authBaseUrl?: string;
  authClientId?: string;
  debugEnabled?: boolean | string;
  sentryDsn?: string;
  sentryEnvironment?: string;
  sentryRelease?: string;
};

type RuntimeConfigKey = keyof RuntimeConfig;

declare global {
  interface Window {
    __YACHT_GAME_CONFIG__?: RuntimeConfig;
  }
}

const getRuntimeConfig = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.__YACHT_GAME_CONFIG__;
};

const normalizeString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();

  return normalized === '' ? undefined : normalized;
};

const normalizeBoolean = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
};

export const getRuntimeString = (configKey: RuntimeConfigKey) =>
  normalizeString(getRuntimeConfig()?.[configKey]);

export const getRuntimeBoolean = (
  configKey: RuntimeConfigKey,
  defaultValue = false
) => normalizeBoolean(getRuntimeConfig()?.[configKey]) ?? defaultValue;
