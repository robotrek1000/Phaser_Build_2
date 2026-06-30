import { GameObjects, Physics } from 'phaser';

export interface EnergyShieldRepulsionAnimationConfig {
  distancePx: number;
}

export interface PlayEnergyShieldRepulsionAnimationArgs {
  object: Physics.Arcade.Sprite;
  energyShield: GameObjects.Graphics;
  config: EnergyShieldRepulsionAnimationConfig;
}
