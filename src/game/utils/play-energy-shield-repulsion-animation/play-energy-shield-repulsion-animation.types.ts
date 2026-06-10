import * as Phaser from 'phaser';

export interface EnergyShieldRepulsionAnimationConfig {
  distancePx: number;
}

export interface PlayEnergyShieldRepulsionAnimationArgs {
  object: Phaser.Physics.Arcade.Sprite;
  energyShield: Phaser.GameObjects.Graphics;
  config: EnergyShieldRepulsionAnimationConfig;
}
