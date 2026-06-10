import * as Phaser from 'phaser';

import {
  ENERGY_SHIELD_CONFIG,
  ENERGY_SHIELD_HIDE_ANIMATION,
  ENERGY_SHIELD_SHOW_ANIMATION,
} from './energy-shield.config';

import { scaled, tweenToPromise } from '@/game/utils';

export class EnergyShield {
  private readonly scene: Phaser.Scene;
  private graphics?: Phaser.GameObjects.Graphics;

  private isShowAnimationActive = false;

  private isHideAnimationActive = false;

  get arcadeColliderType() {
    return this.graphics;
  }

  private get body() {
    return this.graphics?.body as Phaser.Physics.Arcade.Body;
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.isShowAnimationActive = false;
    this.isHideAnimationActive = false;

    this.graphics = this.scene.add.graphics();
    this.graphics
      .setDepth(ENERGY_SHIELD_CONFIG.depth)
      .setVisible(false)
      .setAlpha(0)
      .setScale(ENERGY_SHIELD_CONFIG.scale);

    this.scene.physics.add.existing(this.graphics);

    this.body.setBounce(...ENERGY_SHIELD_CONFIG.bounce);
    this.body.setImmovable(ENERGY_SHIELD_CONFIG.immovable);

    this.body.pushable = false;
    this.body.enable = false;

    this.redraw();
  }

  show() {
    if (!this.graphics || this.isShowAnimationActive) {
      return;
    }

    this.isShowAnimationActive = true;

    this.graphics.setVisible(true);

    this.scene.tweens.killTweensOf(this.graphics);

    this.scene.tweens.add({
      targets: this.graphics,
      ...ENERGY_SHIELD_SHOW_ANIMATION,
      onComplete: () => {
        this.isShowAnimationActive = false;
        this.body.enable = true;
      },
    });
  }

  async hide(force?: boolean) {
    if (!this.graphics || this.isHideAnimationActive) {
      return Promise.resolve();
    }

    this.body.enable = false;

    const onComplete = () => {
      this.graphics?.setVisible(false);

      this.isHideAnimationActive = false;
    };

    this.isHideAnimationActive = true;

    this.scene.tweens.killTweensOf(this.graphics);

    if (force) {
      onComplete();

      return Promise.resolve();
    }

    return tweenToPromise(this.scene, {
      targets: this.graphics,
      ...ENERGY_SHIELD_HIDE_ANIMATION,
      onComplete,
    });
  }

  updatePosition(x: number, y: number) {
    this.graphics?.setPosition(x, y + ENERGY_SHIELD_CONFIG.yOffsetPx);
  }

  destroy() {
    this.graphics?.destroy();
    this.graphics = undefined;
  }

  private redraw() {
    if (!this.graphics) {
      return;
    }

    const cfg = ENERGY_SHIELD_CONFIG;
    const radius = scaled(cfg.radiusPx);
    const thickness = Math.max(1, scaled(cfg.thicknessPx));
    const steps = Math.max(4, scaled(cfg.gradientSteps));

    const outerColor = Phaser.Display.Color.ValueToColor(cfg.outerColor);
    const innerColor = Phaser.Display.Color.ValueToColor(cfg.innerColor);

    this.graphics.clear();

    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(
        outerColor,
        innerColor,
        100,
        Math.round(t * 100)
      );

      const color = Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
      const alpha = Phaser.Math.Linear(cfg.outerAlpha, cfg.innerAlpha, t);
      const ringRadius = radius - t * thickness;

      this.graphics.lineStyle(Math.max(1, thickness / steps), color, alpha);
      this.graphics.strokeCircle(0, 0, Math.max(1, ringRadius));
    }

    this.body.setCircle(
      scaled(ENERGY_SHIELD_CONFIG.radiusPx),
      -scaled(ENERGY_SHIELD_CONFIG.radiusPx),
      -scaled(ENERGY_SHIELD_CONFIG.radiusPx)
    );
  }
}
