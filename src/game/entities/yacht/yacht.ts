import { Input, Math as PhaserMath, Physics, Scene, Tweens } from 'phaser';

import { EnergyShield } from '../energy-shield';

import {
  SHADOW_CONFIG,
  YACHT_ANIMATIONS_CONFIG,
  YACHT_CONFIG,
} from './yacht.config';

import type { YachtAnimationType } from '@/game/entities/yacht/yacht.types';

import { GameState } from '@/game/system/game-state';
import {
  applyRectHitbox,
  playBlinkAnimation,
  scaled,
  tweenToPromise,
} from '@/game/utils';
import { delay } from '@/utils';

export class Yacht {
  private config = YACHT_CONFIG;
  private animationsConfig = YACHT_ANIMATIONS_CONFIG;

  private scene: Scene;

  private gameState: GameState;

  private energyShield: EnergyShield;

  private image?: Physics.Arcade.Image;

  private animation?: Tweens.Tween | Tweens.Tween[];

  private animationType?: YachtAnimationType;

  private isPointerMoving = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private targetX = 0;
  private targetY = 0;
  private isDragging = false;
  private isInputEnabled = false;

  get arcadeColliderType() {
    return this.image;
  }

  get energyShieldArcadeColliderType() {
    return this.energyShield.arcadeColliderType;
  }

  private get imageBody() {
    return this.image?.body as Physics.Arcade.Body;
  }

  private get textureKey() {
    return YACHT_CONFIG.textures[this.gameState.yachtSkin];
  }

  constructor(scene: Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;

    this.energyShield = new EnergyShield(scene);
  }

  create() {
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.isDragging = false;
    this.isInputEnabled = false;

    const { width, height } = this.scene.scale;

    this.image = this.scene.physics.add
      .image(width / 2, 0, this.textureKey)
      .setDisplaySize(scaled(YACHT_CONFIG.width), scaled(YACHT_CONFIG.height))
      .setOrigin(0.5, 0.5)
      .setDepth(this.config.depth)
      .setImmovable(true);

    this.imageBody.setAllowGravity(false);
    this.image.setPosition(width / 2, height + this.image.displayHeight * 0.5);
    this.updateMovingTarget();
    this.energyShield.create();
    this.energyShield.updatePosition(this.image.x, this.image.y);

    applyRectHitbox(this.image, this.config.bodySizeRatio);

    this.addShadow();
    this.bindInput();
  }

  update() {
    if (!this.image) {
      return;
    }

    this.updateAnimation();
    this.move();
    this.energyShield.updatePosition(this.image.x, this.image.y);
  }

  destroy() {
    this.unbindInput();

    this.image?.destroy();
    this.energyShield.destroy();

    this.image = undefined;
  }

  async finishGame() {
    this.disableInput();

    await this.stopAnimation();

    if (this.gameState.isAtPort) {
      return;
    }

    return this.playDeathAnimation();
  }

  async playIntroAnimation() {
    const { height } = this.scene.scale;
    const { yRatio, ...tweenConfig } = this.animationsConfig.intro;

    await tweenToPromise(this.scene, {
      targets: this.image,
      y: height * yRatio,
      ...tweenConfig,
    });

    this.updateMovingTarget();
  }

  enableInput() {
    this.updateMovingTarget();

    this.isInputEnabled = true;
  }

  disableInput() {
    this.isInputEnabled = false;
  }

  private addShadow() {
    this.image?.enableFilters();

    if (!this.image?.filters?.external) {
      return;
    }

    const { x, y, decay, power, color, samples, intensity } = SHADOW_CONFIG;

    this.image.filters.external.addShadow(
      x,
      y,
      decay,
      power,
      color,
      samples,
      intensity
    );
  }

  private updateAnimation() {
    if (this.gameState.hasEnergyShield) {
      return this.playEnergyShieldAnimation();
    }

    if (this.gameState.hasWhirlpoolDebuff) {
      return this.playWhirlpoolAnimation();
    }

    if (this.gameState.isInvulnerable) {
      return this.playDamageHitAnimation();
    }

    if (this.gameState.hasSpeedDebuff) {
      return this.playSlowSpeedAnimation();
    }

    if (this.gameState.isInvulnerable) {
      return this.playDamageHitAnimation();
    }

    if (this.animationType === 'positiveHit') {
      return;
    }

    void this.stopAnimation();
  }

  private async stopAnimation() {
    if (!this.animation) {
      return;
    }

    if (this.animationType === 'energyShield') {
      await this.energyShield.hide(this.gameState.isGameOver);
    }

    if (Array.isArray(this.animation)) {
      this.animation.forEach((tween) => tween.stop());
    } else {
      this.animation?.stop();
    }

    if (this.image) {
      this.image.rotation = 0;

      this.image.clearTint();
      this.image.setAlpha(1);
    }

    this.animation = undefined;
    this.animationType = undefined;
  }

  async playPositiveHitAnimation() {
    if (!this.image || this.animationType) {
      return;
    }

    this.animationType = 'positiveHit';
    this.animation = playBlinkAnimation(
      this.image,
      this.animationsConfig.greenBuoyHit
    );

    await delay(this.animationsConfig.greenBuoyHitDuration);

    if (this.animationType === 'positiveHit') {
      await this.stopAnimation();
    }
  }

  private bindInput() {
    if (!this.image) {
      return;
    }

    this.unbindInput();

    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);
  }

  private unbindInput() {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointerupoutside', this.handlePointerUp, this);
  }

  private handlePointerDown(pointer: Input.Pointer) {
    if (!this.isInputEnabled) {
      return;
    }

    this.lastPointerX = pointer.x;
    this.lastPointerY = pointer.y;
    this.isDragging = true;
  }

  private async handlePointerMove(pointer: Input.Pointer) {
    if (!this.image || !this.isDragging || !this.isInputEnabled) {
      return;
    }

    const verticalInset =
      this.image.displayHeight * this.config.verticalInsetRatio;

    const deltaX = pointer.x - this.lastPointerX;
    const deltaY = pointer.y - this.lastPointerY;

    this.lastPointerX = pointer.x;
    this.lastPointerY = pointer.y;

    const x = PhaserMath.Clamp(
      this.targetX + deltaX,
      0,
      this.scene.scale.width
    );

    const y = PhaserMath.Clamp(
      this.targetY + deltaY,
      verticalInset,
      this.scene.scale.height - verticalInset
    );

    this.targetX = x;
    this.targetY = y;
    this.isPointerMoving = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;
  }

  private handlePointerUp() {
    this.isDragging = false;
  }

  private async playDeathAnimation() {
    if (!this.image) {
      return;
    }

    const { height } = this.scene.scale;

    await tweenToPromise(this.scene, {
      targets: this.image,
      y: this.image.y - this.animationsConfig.deathPreLift.y,
      duration: this.animationsConfig.deathPreLift.duration,
      ease: this.animationsConfig.deathPreLift.ease,
    });

    return Promise.all([
      tweenToPromise(this.scene, {
        targets: this.image,
        rotation:
          this.image.rotation +
          Math.PI * 2 * this.animationsConfig.deathRotation.turns,
        duration: this.animationsConfig.deathRotation.duration,
        ease: this.animationsConfig.deathRotation.ease,
      }),
      tweenToPromise(this.scene, {
        targets: this.image,
        y:
          height +
          this.image.displayHeight * 0.5 +
          this.animationsConfig.deathFall.offscreenExtraPx,
        duration: this.animationsConfig.deathFall.duration,
        ease: this.animationsConfig.deathFall.ease,
      }),
    ]);
  }

  private playEnergyShieldAnimation() {
    if (!this.image || this.animationType === 'energyShield') {
      return;
    }

    void this.stopAnimation();

    this.animationType = 'energyShield';

    this.energyShield.show();

    this.animation = playBlinkAnimation(
      this.image,
      this.animationsConfig.energyShieldAction
    );
  }

  private playWhirlpoolAnimation() {
    if (!this.image || this.animationType === 'whirlpool') {
      return;
    }

    void this.stopAnimation();

    this.animationType = 'whirlpool';
    this.animation = this.scene.tweens.addMultiple([
      {
        targets: this.image,
        ...this.animationsConfig.whirlpool,
      },
      playBlinkAnimation(this.image, this.animationsConfig.damageHit),
    ]);
  }

  private playSlowSpeedAnimation() {
    if (!this.image || this.animationType === 'slowSpeed') {
      return;
    }

    void this.stopAnimation();

    this.animationType = 'slowSpeed';
    this.animation = playBlinkAnimation(
      this.image,
      this.animationsConfig.damageHit
    );
  }

  private playDamageHitAnimation() {
    if (!this.image || this.animationType === 'damageHit') {
      return;
    }

    void this.stopAnimation();

    this.animationType = 'damageHit';
    this.animation = playBlinkAnimation(
      this.image,
      this.animationsConfig.damageHit
    );
  }

  private updateMovingTarget() {
    if (!this.image) {
      return;
    }

    this.targetX = this.image.x;
    this.targetY = this.image.y;
  }

  private move() {
    if (!this.image || !this.isInputEnabled) {
      return;
    }

    const lerp = (() => {
      if (this.gameState.hasWhirlpoolDebuff) {
        return this.config.movingLerp.whirlpoolDebuff;
      }

      const factor = this.isPointerMoving ? 1 : 0.5;

      return (
        this.config.movingLerp[
          this.gameState.hasFastSteeringWheel ? 'fastSteeringWheel' : 'normal'
        ] * factor
      );
    })();

    this.image.x = PhaserMath.Linear(this.image.x, this.targetX, lerp);
    this.image.y = PhaserMath.Linear(this.image.y, this.targetY, lerp);

    if (Math.abs(this.image.x - this.targetX) < 0.5) {
      this.image.x = this.targetX;
    }

    if (Math.abs(this.image.y - this.targetY) < 0.5) {
      this.image.y = this.targetY;
    }
  }
}
