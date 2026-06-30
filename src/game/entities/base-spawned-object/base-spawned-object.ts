import { GameObjects, Math as PhaserMath, Physics } from 'phaser';

import {
  CLEANUP_Y_EXTRA,
  PLAY_AREA_CONFIG,
  SPAWN_OBJECT_DATA,
} from './base-spawned-object.config';

import type { BaseSpawnedObjectConfig } from './base-spawned-object.types';
import type { SpawnObjectConfig } from '@/game/level-design';

import { GAME_SCENE_OBJECT } from '@/game/scenes/game-scene';
import { GameState } from '@/game/system/game-state';
import { scaled } from '@/game/utils';

export abstract class BaseSpawnedObject extends Physics.Arcade.Sprite {
  private isDespawning = false;

  protected abstract config: BaseSpawnedObjectConfig;

  protected gameState?: GameState;

  get isMarkedToDelete() {
    return this.isDespawning;
  }

  get playArea() {
    const { width } = this.scene.scale;

    return {
      left: Math.round(width * PLAY_AREA_CONFIG.leftPaddingRatio),
      right: Math.round(width * PLAY_AREA_CONFIG.rightPaddingRatio),
    };
  }

  protected get configTextureKey() {
    return typeof this.config.textureKey === 'string'
      ? this.config.textureKey
      : this.config.textureKey[this.gameState?.level ?? 1];
  }

  protected get configWidth() {
    return typeof this.config.width === 'number'
      ? this.config.width
      : this.config.width[this.gameState?.level ?? 1];
  }

  protected get configHeight() {
    return typeof this.config.height === 'number'
      ? this.config.height
      : this.config.height[this.gameState?.level ?? 1];
  }

  protected get player(): Physics.Arcade.Image {
    return this.scene.data.get(GAME_SCENE_OBJECT.PLAYER);
  }

  protected get worldFallSpeedPxPerSec() {
    return this.gameState?.worldFallSpeedPxPerSec ?? 0;
  }

  preUpdate(time: number, delta: number) {
    this.tryAutoDespawn();

    super.preUpdate(time, delta);

    if (!this.active || this.isMarkedToDelete) {
      return;
    }

    this.updateVelocityY();
  }

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    this.gameState = gameState;
    this.isDespawning = false;

    const body = this.body as Physics.Arcade.Body;

    this.setActive(true)
      .setVisible(true)
      .setTexture(this.configTextureKey)
      .setAlpha(this.config.alpha)
      .setRotation(this.config.rotation)
      .setScale(this.config.scale)
      .setDisplaySize(scaled(this.configWidth), scaled(this.configHeight))
      .setDepth(this.config.depth)
      .setPosition(this.resolveSpawnX(config), this.resolveSpawnY(config))
      .setData(SPAWN_OBJECT_DATA.TYPE, config.type);

    if (Array.isArray(this.config.bounce)) {
      this.setBounce(...this.config.bounce);
    }

    if (this.config.damping !== undefined) {
      this.setDamping(this.config.damping);
    }

    if (this.config.drag !== undefined) {
      this.setDrag(this.config.drag);
    }

    this.updateVelocityY();

    body.enable = true;

    body.setAllowGravity(this.config.allowGravity);
    body.setImmovable(this.config.immovable);
  }

  async despawn(withAnimation = true) {
    if (!this.active || this.isMarkedToDelete) {
      return;
    }

    this.isDespawning = true;

    if (withAnimation) {
      await this.playDespawnAnimation();
    }

    this.setActive(false);

    const body = this.body as Physics.Arcade.Body;

    body.stop();

    body.enable = false;

    this.setVisible(false);

    this.gameState = undefined;
  }

  async handleEnergyShieldCollision(_energyShield: GameObjects.Graphics) {}

  protected updateVelocityY() {
    const velocityY =
      this.worldFallSpeedPxPerSec * this.config.speedYMultiplier;

    if (this.body?.velocity.y !== velocityY) {
      this.setVelocityY(velocityY);
    }
  }

  protected async playDespawnAnimation() {}

  protected resolveSpawnX(config: SpawnObjectConfig) {
    const playArea = this.playArea;
    const range = playArea.right - playArea.left;
    const ratio = config.xRatio ?? 0.5;
    const baseX = playArea.left + range * PhaserMath.Clamp(ratio, 0, 1);
    const x = baseX + (config.xOffsetPx ?? 0);

    return PhaserMath.Clamp(x, playArea.left + 8, playArea.right - 8);
  }

  protected resolveSpawnY(_config: SpawnObjectConfig) {
    return -this.configHeight;
  }

  private tryAutoDespawn() {
    const cleanupThresholdY = this.scene.scale.height + CLEANUP_Y_EXTRA;
    const spriteTopY = this.getBounds().top;

    if (spriteTopY >= cleanupThresholdY) {
      void this.despawn(false);
    }
  }
}
