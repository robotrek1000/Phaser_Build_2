import * as Phaser from 'phaser';

import { SPAWN_GROUP_MAP_CONFIG } from './spawn-manager.config';

import type { SpawnObjectType } from '@/game/game.types';
import type { SpawnObjectConfig } from '@/game/level-design';

import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';
import { GameState } from '@/game/system/game-state';

export class SpawnManager {
  private scene: Phaser.Scene;

  private gameState: GameState;

  private spawnObjectsScenario: SpawnObjectConfig[] = [];

  private spawnGroups = new Map<SpawnObjectType, Phaser.Physics.Arcade.Group>();

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  private get distanceMeters() {
    return this.gameState.distanceProgress ?? 0;
  }

  init(spawnObjectsScenario: SpawnObjectConfig[]) {
    this.spawnObjectsScenario = [...spawnObjectsScenario];
  }

  create() {
    Object.entries(SPAWN_GROUP_MAP_CONFIG).forEach(([key, classType]) => {
      this.spawnGroups.set(
        key as SpawnObjectType,
        this.scene.physics.add.group({ classType })
      );
    });
  }

  update() {
    if (!this.spawnObjectsScenario.length) {
      return;
    }

    this.pickSpawnReadyObjects().forEach((spawnObjectConfig) =>
      this.spawnObject(spawnObjectConfig)
    );
  }

  getSpawnGroups() {
    return this.spawnGroups;
  }

  private pickSpawnReadyObjects() {
    const distance = this.distanceMeters;
    const index = this.spawnObjectsScenario.findIndex(
      ({ spawnDistance }) => spawnDistance > distance
    );
    const readyObjects =
      index < 0
        ? this.spawnObjectsScenario
        : this.spawnObjectsScenario.slice(0, index);

    this.spawnObjectsScenario =
      index < 0 ? [] : this.spawnObjectsScenario.slice(index);

    return readyObjects;
  }

  private spawnObject(item: SpawnObjectConfig) {
    const group = this.spawnGroups.get(item.type);

    if (!group) {
      return;
    }

    const obj = group.get() as BaseSpawnedObject | null;

    if (!obj) {
      return;
    }

    obj.spawn(item, this.gameState);
  }
}
