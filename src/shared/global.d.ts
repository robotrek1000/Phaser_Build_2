import { RuntimeConfig } from './types';

declare global {
  interface Window {
    __YACHT_GAME_CONFIG__?: RuntimeConfig;
  }
}
