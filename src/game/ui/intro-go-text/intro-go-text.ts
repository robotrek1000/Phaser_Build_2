import * as Phaser from 'phaser';

import { INTRO_GO_TEXT_CONFIG } from '@/game/ui/intro-go-text/intro-go-text.config';
import { scaled, tweenToPromise } from '@/game/utils';

export class IntroGoText {
  private scene: Phaser.Scene;

  private textObject?: Phaser.GameObjects.Text;

  private baseX = 0;
  private baseY = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    const { width, height } = this.scene.scale;
    const {
      position: { xRatio, yRatio },
      text,
      style,
      depth,
    } = INTRO_GO_TEXT_CONFIG;

    this.baseX = width * xRatio;
    this.baseY = height * yRatio;

    this.textObject = this.scene.add
      .text(this.baseX, this.baseY, text, {
        ...style,
        fontSize: scaled(style.fontSize),
      })
      .setOrigin(0.5)
      .setDepth(depth)
      .setVisible(false)
      .setAlpha(0);
  }

  async play() {
    if (!this.textObject) {
      return Promise.resolve();
    }

    const {
      animation: {
        hopUpPx,
        hopUpDurationMs,
        settleDurationMs,
        holdDurationMs,
        scaleFrom,
        scaleInTo,
        scaleOutTo,
        scaleInEase,
        settleEase,
        scaleOutEase,
        outDurationMs,
      },
    } = INTRO_GO_TEXT_CONFIG;

    const peakY = this.baseY - hopUpPx;

    this.scene.tweens.killTweensOf(this.textObject);

    this.textObject
      .setVisible(true)
      .setAlpha(0)
      .setScale(scaleFrom)
      .setPosition(this.baseX, this.baseY);

    await tweenToPromise(this.scene, {
      targets: this.textObject,
      y: peakY,
      alpha: 1,
      scaleX: scaleInTo,
      scaleY: scaleInTo,
      duration: hopUpDurationMs,
      ease: scaleInEase,
    });
    await tweenToPromise(this.scene, {
      targets: this.textObject,
      y: this.baseY,
      duration: settleDurationMs,
      ease: settleEase,
    });
    await tweenToPromise(this.scene, {
      targets: this.textObject,
      scaleX: scaleOutTo,
      scaleY: scaleOutTo,
      alpha: 0,
      delay: holdDurationMs,
      duration: outDurationMs,
      ease: scaleOutEase,
    });

    this.textObject
      .setVisible(false)
      .setAlpha(0)
      .setScale(scaleFrom)
      .setPosition(this.baseX, this.baseY);
  }
}
