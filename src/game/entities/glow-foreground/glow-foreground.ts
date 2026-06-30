import { GameObjects, Scene } from 'phaser';

import { GLOW_FOREGROUND_CONFIG } from './glow-foreground.config';

export class GlowForeground {
  private scene: Scene;

  private image?: GameObjects.Image;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  create() {
    const { width } = this.scene.scale;

    this.image = this.scene.add
      .image(0, 0, GLOW_FOREGROUND_CONFIG.textureKey)
      .setOrigin(0, 0)
      .setScale(width / GLOW_FOREGROUND_CONFIG.width)
      .setDepth(GLOW_FOREGROUND_CONFIG.depth);
  }

  destroy() {
    this.image?.destroy();

    this.image = undefined;
  }
}
