import type { SpawnObjectType, YachtSkin } from '@/game/game.types';

export type SegmentObjectConfig = {
  type: SpawnObjectType;
  meterOffset: number;
  xRatio?: number;
  xOffsetPx?: number;
};

export type SegmentLengthMeters = 50 | 100;

export interface Segment {
  lengthMeters: SegmentLengthMeters;
  weight: number;
  objectList: SegmentObjectConfig[];
}

export type GamePhase = 'early' | 'mid' | 'late' | 'endgame';

export type SpawnObjectsScenario = Record<GamePhase, Segment[]>;

export type SpawnObjectConfig = Omit<SegmentObjectConfig, 'meterOffset'> & {
  spawnDistance: number;
};

export type LevelId = 1 | 2 | 3;

export interface GameSettings {
  level: LevelId;
  yachtSkin: YachtSkin;
  speedKmh: number;
  fallSpeedPxPerKmh: number;
  isEngineImproved: boolean;
  isBodyReinforced: boolean;
  isSteeringWheelFast: boolean;
  isShieldReinforced: boolean;
}

export interface BonusesLevelConfig {
  count: number;
  bounds: Range;
  minGap: number;
}

export interface LevelConfig {
  scenario: SpawnObjectsScenario;
  gamePhases: Record<GamePhase, Range>;
  timeBonuses: BonusesLevelConfig;
  energyAmount: number;
  timer: number;
}

export interface Level {
  gameSettings: GameSettings;
  spawnObjectsScenario: SpawnObjectConfig[];
  timer: number;
  distance: number;
}

export interface SegmentWithId extends Segment {
  id: string;
}

export type Range = [number, number];
