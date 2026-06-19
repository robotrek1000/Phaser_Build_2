import type { ClientLevelNumber } from '@/shared/types';

export interface BaseSpawnedObjectConfig {
  textureKey: string | Record<ClientLevelNumber, string>;
  depth: number;
  width: number | Record<ClientLevelNumber, number>;
  height: number | Record<ClientLevelNumber, number>;
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
