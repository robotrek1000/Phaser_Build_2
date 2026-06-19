import * as Phaser from 'phaser';

import {
  WATER_BACKGROUND_DEPTH,
  WATER_BACKGROUND_LEVEL_CONFIG,
} from './water-background.config';

import { GameState } from '@/game/system/game-state';

export class WaterBackground {
  private scene: Phaser.Scene;

  private gameState: GameState;

  private tileSprite?: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  create() {
    const { width, height } = this.scene.scale;

    this.tileSprite = this.scene.add
      .tileSprite(
        0,
        0,
        width,
        height,
        WATER_BACKGROUND_LEVEL_CONFIG[this.gameState.level]
      )
      .setOrigin(0, 0)
      .setDepth(WATER_BACKGROUND_DEPTH);
  }

  update(deltaMs: number) {
    if (!this.tileSprite) {
      return;
    }

    const deltaSeconds = deltaMs / 1000;

    const pixelsPerSecond =
      this.gameState.gameState === 'playing'
        ? this.gameState.worldFallSpeedPxPerSec
        : 0;

    const scrollDeltaPx = pixelsPerSecond * deltaSeconds;

    this.tileSprite.tilePositionY -= scrollDeltaPx;
  }

  destroy() {
    this.tileSprite?.destroy();

    this.tileSprite = undefined;
  }
}
