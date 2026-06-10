import type { SpawnObjectType } from '@/game/game.types';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';

export type BaseSpawnedObjectChild<
  T extends BaseSpawnedObject = BaseSpawnedObject,
> = new (
  scene: Phaser.Scene,
  x: number,
  y: number,
  texture: string | Phaser.Textures.Texture,
  frame?: string | number
) => T;

export type SpawnGroupMap = Record<SpawnObjectType, BaseSpawnedObjectChild>;
