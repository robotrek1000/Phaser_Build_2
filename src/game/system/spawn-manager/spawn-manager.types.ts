import { Scene, Textures } from 'phaser';

import type { SpawnObjectType } from '@/game/game.types';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';

export type BaseSpawnedObjectChild<
  T extends BaseSpawnedObject = BaseSpawnedObject,
> = new (
  scene: Scene,
  x: number,
  y: number,
  texture: string | Textures.Texture,
  frame?: string | number
) => T;

export type SpawnGroupMap = Record<SpawnObjectType, BaseSpawnedObjectChild>;
