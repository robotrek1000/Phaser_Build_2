import { GameObjects, Math as PhaserMath, Physics } from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  ENERGY_ATTRACT_MOTION_CONFIG,
  ENERGY_BOB_MOTION_CONFIG,
  ENERGY_CONFIG,
  ENERGY_HITBOX_CONFIG,
  ENERGY_SHADOW_CONFIG,
  ENERGY_SHADOW_MOTION_CONFIG,
} from './energy.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { AttractMotion } from '@/game/motions/attract-motion';
import { BobMotion } from '@/game/motions/bob-motion';
import { GameState } from '@/game/system/game-state';
import {
  applyRectHitbox,
  followShadowScaleMotion,
  scaled,
  tweenToPromise,
} from '@/game/utils';

export class Energy extends BaseSpawnedObject {
  protected config = ENERGY_CONFIG;

  private shadow?: GameObjects.Image;

  protected attractMotion?: AttractMotion;

  private bobMotion?: BobMotion;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRectHitbox(this, ENERGY_HITBOX_CONFIG);

    this.bobMotion = new BobMotion(this, ENERGY_BOB_MOTION_CONFIG);
    this.attractMotion = new AttractMotion({
      sprite: this,
      targetObject: this.player,
      config: ENERGY_ATTRACT_MOTION_CONFIG,
    });

    this.createShadow();
    this.bobMotion.start();
    this.syncShadowMotion();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.bobMotion?.update();

    this.syncShadowMotion();

    if (
      this.gameState?.hasEnergyShield &&
      this.attractMotion?.isInsideMagnetRadius
    ) {
      this.attractMotion.start();
      this.attractMotion.update(
        this.worldFallSpeedPxPerSec * this.config.speedYMultiplier
      );
    } else {
      this.attractMotion?.stop();
      this.setVelocityX(0);
    }
  }

  async despawn(withAnimation = true) {
    this.attractMotion?.stop();
    this.bobMotion?.stop();
    this.shadow?.setVisible(false);

    this.attractMotion = undefined;
    this.bobMotion = undefined;

    await super.despawn(withAnimation);

    this.shadow?.setVisible(false);
  }

  protected override async playDespawnAnimation() {
    const player = this.player;

    const body = this.body as Physics.Arcade.Body | undefined;

    if (body) {
      body.stop();
      body.enable = false;
    }

    if (!player?.active) {
      this.setAlpha(0);
      return;
    }

    const startX = this.x;
    const startY = this.y;
    const startScaleX = this.scaleX;
    const startScaleY = this.scaleY;

    const state = { t: 0 };
    const arcOffsetX = PhaserMath.Between(-60, 60);
    const arcOffsetY = -PhaserMath.Between(40, 110);

    await tweenToPromise(this.scene, {
      targets: state,
      t: 1,
      duration: 380,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        const t = state.t;
        const endX = player.x;
        const endY = player.y;

        const midX = (startX + endX) * 0.5 + arcOffsetX;
        const midY = Math.min(startY, endY) + arcOffsetY;

        const ax = PhaserMath.Linear(startX, midX, t);
        const ay = PhaserMath.Linear(startY, midY, t);
        const bx = PhaserMath.Linear(midX, endX, t);
        const by = PhaserMath.Linear(midY, endY, t);

        this.x = PhaserMath.Linear(ax, bx, t);
        this.y = PhaserMath.Linear(ay, by, t);

        const scaleFactor = PhaserMath.Linear(1, 0, t);
        this.setScale(startScaleX * scaleFactor, startScaleY * scaleFactor);
        this.setAlpha(PhaserMath.Linear(1, 0, t));
      },
    });
  }

  private createShadow() {
    if (this.shadow) {
      this.shadow.setVisible(true);
      return;
    }

    this.shadow = this.scene.add
      .image(
        this.x,
        this.y + scaled(ENERGY_SHADOW_MOTION_CONFIG.yOffset),
        ENERGY_SHADOW_CONFIG.textureKey
      )
      .setDisplaySize(
        scaled(ENERGY_SHADOW_CONFIG.width),
        scaled(ENERGY_SHADOW_CONFIG.height)
      )
      .setDepth(ENERGY_SHADOW_CONFIG.depth);
  }

  private syncShadowMotion() {
    followShadowScaleMotion({
      target: this,
      shadow: this.shadow,
      config: ENERGY_SHADOW_MOTION_CONFIG,
      targetYOffset: this.bobMotion?.yOffset,
      targetYOffsetRatio: this.bobMotion?.yOffsetRatio,
    });
  }
}
