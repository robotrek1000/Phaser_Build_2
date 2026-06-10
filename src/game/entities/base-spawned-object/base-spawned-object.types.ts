import type { LevelId } from '@/game/level-design';

export interface BaseSpawnedObjectConfig {
  textureKey: string | Record<LevelId, string>;
  depth: number;
  width: number | Record<LevelId, number>;
  height: number | Record<LevelId, number>;
  speedYMultiplier: number;
  alpha: number;
  rotation: number;
  scale: number;
  allowGravity: boolean;
  immovable: boolean;
  bounce?: [number, number?];
  damping?: boolean;
  drag?: number;
}

export interface BaseSpawnedObjectShadowConfig {
  x?: number;
  y?: number;
  decay?: number;
  power?: number;
  color?: number;
  samples?: number;
  intensity?: number;
}
