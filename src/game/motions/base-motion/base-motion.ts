import * as Phaser from 'phaser';

export abstract class BaseMotion {
  protected sprite: Phaser.Physics.Arcade.Sprite;

  protected isEnabled = false;

  get isActive() {
    return this.isEnabled;
  }

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
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
