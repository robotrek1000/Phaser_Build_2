import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';

export abstract class BaseMotion {
  protected sprite: BaseSpawnedObject;

  protected isEnabled = false;

  get isActive() {
    return this.isEnabled;
  }

  constructor(sprite: BaseSpawnedObject) {
    this.sprite = sprite;
  }

  start() {
    this.isEnabled = true;
  }

  stop() {
    this.isEnabled = false;
  }

  abstract update(time: number, delta: number): void;
}
