import {
  LEVEL_1_CONFIG,
  LEVEL_2_CONFIG,
  LEVEL_3_CONFIG,
} from './levels-config';

import type { GamePhase, GameSettings, LevelConfig, Segment } from './types';
import type { ClientLevelNumber } from '@/shared/types';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  level: 1,
  yachtSkin: 'Normal',
  speedKmh: 25,
  fallSpeedPxPerKmh: 500,
  isEngineImproved: false,
  isBodyReinforced: false,
  isSteeringWheelFast: false,
  isShieldReinforced: false,
};

export const LEVEL_CONFIGS: Record<ClientLevelNumber, LevelConfig> = {
  1: LEVEL_1_CONFIG,
  2: LEVEL_2_CONFIG,
  3: LEVEL_3_CONFIG,
};

export const GAME_PHASES_ORDER: GamePhase[] = [
  'early',
  'mid',
  'late',
  'endgame',
];

export const FINAL_PHASE_LENGTH = 50;

export const HARBOR_SEGMENT: Segment = {
  lengthMeters: 50,
  weight: 1,
  objectList: [{ type: 'harbor', meterOffset: 50, xRatio: 0.5 }],
};
