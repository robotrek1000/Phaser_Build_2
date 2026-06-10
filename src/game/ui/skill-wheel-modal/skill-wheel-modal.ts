import * as Phaser from 'phaser';

import {
  BAR_CONFIG,
  CONTAINER_CONFIG,
  CONTINUE_CONFIG,
  GLOW_CONFIG,
  INTRO_TEXT_CONFIG,
  OVERLAY_CONFIG,
  POINTER_CONFIG,
  RESULT_BODY_CONFIG,
  RESULT_ICON_CONFIG,
  RESULT_TITLE_CONFIG,
  REWARDS_CONFIG,
} from './skill-wheel-modal.config';
import { setResultIconSize } from './skill-wheel-modal.utils';

import type { RewardNumber } from './skill-wheel-modal.types';
import type { SkillWheelBonus } from '@/game/system/game-state';

import { delay, tweenToPromise, inputOnceToPromise } from '@/game/utils';

export class SkillWheelModal {
  private readonly scene: Phaser.Scene;

  private overlay?: Phaser.GameObjects.Rectangle;
  private glow?: Phaser.GameObjects.Arc;
  private container?: Phaser.GameObjects.Container;
  private bar?: Phaser.GameObjects.Image;
  private pointer?: Phaser.GameObjects.Container;
  private introText?: Phaser.GameObjects.Text;
  private resultIcon?: Phaser.GameObjects.Image;
  private resultTitleText?: Phaser.GameObjects.Text;
  private resultBodyText?: Phaser.GameObjects.Text;
  private continueText?: Phaser.GameObjects.Text;

  private pointerTween?: Phaser.Tweens.Tween;
  private continueTween?: Phaser.Tweens.Tween;

  private isVisible = false;
  private selectedSectorNumber?: RewardNumber;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.isVisible = false;

    this.createOverlay();
    this.createContainer();
    this.createGlow();
    this.createBar();
    this.createPointer();
    this.createIntroText();
    this.createResultIcon();
    this.createResultTitleText();
    this.createResultBodyText();
    this.createContinueText();
  }

  async show(): Promise<SkillWheelBonus> {
    if (this.isVisible) {
      throw new Error('The skill wheel modal has already been shown');
    }

    this.isVisible = true;

    this.showBonusWheel();
    this.startSpin();

    await inputOnceToPromise(this.scene, 'pointerdown');
    await this.stopSpin();
    await delay(100);

    this.showResult();

    await inputOnceToPromise(this.scene, 'pointerdown');

    this.hide();

    this.isVisible = false;

    if (!this.selectedSectorNumber) {
      throw new Error('A sector is not selected');
    }

    return REWARDS_CONFIG[this.selectedSectorNumber].bonus;
  }

  destroy() {
    this.overlay?.destroy();
    this.glow?.destroy();
    this.container?.destroy();
    this.bar?.destroy();
    this.bar?.destroy();
    this.pointer?.destroy();
    this.introText?.destroy();
    this.resultIcon?.destroy();
    this.resultTitleText?.destroy();
    this.resultBodyText?.destroy();
    this.continueText?.destroy();

    this.overlay = undefined;
    this.glow = undefined;
    this.container = undefined;
    this.bar = undefined;
    this.bar = undefined;
    this.pointer = undefined;
    this.introText = undefined;
    this.resultIcon = undefined;
    this.resultTitleText = undefined;
    this.resultBodyText = undefined;
    this.continueText = undefined;
  }

  private createOverlay() {
    const { width, height } = this.scene.scale;

    this.overlay = this.scene.add
      .rectangle(
        0,
        0,
        width,
        height,
        OVERLAY_CONFIG.color,
        OVERLAY_CONFIG.alpha
      )
      .setOrigin(0, 0)
      .setDepth(OVERLAY_CONFIG.depth)
      .setVisible(false);
  }

  private createContainer() {
    const { width, height } = this.scene.scale;

    const centerX = width * CONTAINER_CONFIG.centerXRatio;
    const centerY = height * CONTAINER_CONFIG.centerYRatio;

    this.container = this.scene.add
      .container(centerX, centerY)
      .setDepth(CONTAINER_CONFIG.depth)
      .setVisible(false);
  }

  private createGlow() {
    if (!this.container) {
      return;
    }

    this.glow = this.scene.add.circle(
      0,
      0,
      240,
      GLOW_CONFIG.color,
      GLOW_CONFIG.alpha
    );

    this.container.add(this.glow);
  }

  private createBar() {
    if (!this.container) {
      return;
    }

    this.bar = this.scene.add
      .image(BAR_CONFIG.offsetX, BAR_CONFIG.offsetY, BAR_CONFIG.baseTextureKey)
      .setOrigin(0.5, 0.5)
      .setScale(BAR_CONFIG.scale);

    this.container.add(this.bar);
  }

  private createPointer() {
    if (!this.container) {
      return;
    }

    this.pointer = this.scene.add.container(
      POINTER_CONFIG.offsetX,
      POINTER_CONFIG.offsetY
    );

    const pointerImage = this.scene.add
      .image(0, 0, POINTER_CONFIG.baseTextureKey)
      .setOrigin(POINTER_CONFIG.originX, POINTER_CONFIG.originY)
      .setScale(POINTER_CONFIG.scale);

    this.pointer.add(pointerImage);
    this.container.add(this.pointer);
  }

  private createIntroText() {
    if (!this.container) {
      return;
    }

    this.introText = this.scene.add
      .text(
        0,
        INTRO_TEXT_CONFIG.offsetY,
        INTRO_TEXT_CONFIG.text,
        INTRO_TEXT_CONFIG.style
      )
      .setOrigin(0.5, 0.5);

    this.container.add(this.introText);
  }

  private createResultIcon() {
    if (!this.container) {
      return;
    }

    this.resultIcon = this.scene.add.image(
      RESULT_ICON_CONFIG.offsetX,
      RESULT_ICON_CONFIG.offsetY,
      RESULT_ICON_CONFIG.baseTextureKey
    );

    setResultIconSize(
      this.resultIcon,
      RESULT_ICON_CONFIG.maxWidth,
      RESULT_ICON_CONFIG.maxHeight
    );
    this.resultIcon.setVisible(false);

    this.container.add(this.resultIcon);
  }

  private createResultTitleText() {
    if (!this.container) {
      return;
    }

    this.resultTitleText = this.scene.add
      .text(
        RESULT_TITLE_CONFIG.offsetX,
        RESULT_TITLE_CONFIG.offsetY,
        '',
        RESULT_TITLE_CONFIG.style
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.container.add(this.resultTitleText);
  }

  private createResultBodyText() {
    if (!this.container) {
      return;
    }

    this.resultBodyText = this.scene.add
      .text(0, RESULT_BODY_CONFIG.offsetY, '', RESULT_BODY_CONFIG.style)
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.container.add(this.resultBodyText);
  }

  private createContinueText() {
    if (!this.container) {
      return;
    }

    this.continueText = this.scene.add
      .text(
        0,
        CONTINUE_CONFIG.offsetY,
        CONTINUE_CONFIG.text,
        CONTINUE_CONFIG.style
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(CONTINUE_CONFIG.alpha)
      .setVisible(false);

    this.container.add(this.continueText);
  }

  private showBonusWheel() {
    this.overlay?.setVisible(true);
    this.container?.setVisible(true);
    this.glow?.setVisible(true);
    this.bar?.setVisible(true);
    this.pointer?.setVisible(true);
    this.introText?.setVisible(true);
    this.continueText?.setVisible(false);
    this.resultTitleText?.setVisible(false);
    this.resultBodyText?.setVisible(false);
    this.resultIcon?.setVisible(false);
  }

  private showResult() {
    if (!this.selectedSectorNumber) {
      throw new Error('A sector is not selected');
    }

    const rewardConfig = REWARDS_CONFIG[this.selectedSectorNumber];

    this.glow?.setVisible(false);
    this.bar?.setVisible(false);
    this.pointer?.setVisible(false);
    this.introText?.setVisible(false);

    this.resultIcon?.setVisible(true);
    this.resultTitleText?.setVisible(true);
    this.resultBodyText?.setVisible(true);
    this.continueText?.setVisible(true);

    if (this.continueText) {
      this.continueText.setAlpha(CONTINUE_CONFIG.alpha);

      this.continueTween = this.scene.tweens.add({
        targets: this.continueText,
        ...CONTINUE_CONFIG.tween,
      });
    }

    if (this.resultIcon) {
      this.resultIcon.setTexture(rewardConfig.iconKey);
      setResultIconSize(
        this.resultIcon,
        RESULT_ICON_CONFIG.maxWidth,
        RESULT_ICON_CONFIG.maxHeight
      );
      this.resultIcon.clearTint();
      this.resultIcon.setAlpha(1);
    }

    this.resultTitleText?.setText(rewardConfig.title);
    this.resultBodyText?.setText(
      rewardConfig.bodyLine2
        ? `${rewardConfig.bodyLine1}\n${rewardConfig.bodyLine2}`
        : rewardConfig.bodyLine1
    );
  }

  private hide() {
    this.overlay?.setVisible(false);
    this.container?.setVisible(false);
    this.introText?.setVisible(false);
    this.continueText?.setVisible(false);
    this.resultTitleText?.setVisible(false);
    this.resultBodyText?.setVisible(false);
    this.resultIcon?.setVisible(false);

    this.continueTween?.stop();

    this.continueTween = undefined;
  }

  private startSpin() {
    this.pointer?.setAngle(POINTER_CONFIG.initialAngleDeg);

    this.pointerTween = this.scene.tweens.add({
      targets: this.pointer,
      ...POINTER_CONFIG.startTween,
    });
  }

  private async stopSpin() {
    if (!this.pointerTween) {
      throw new Error('The pointer tween is not defined');
    }

    await delay(Phaser.Math.Between(100, 600));

    this.pointerTween.stop();

    await this.selectSector();
  }

  private async selectSector() {
    const sectorDeg =
      parseInt(POINTER_CONFIG.startTween.angle.replace(/\D/g, '')) /
      BAR_CONFIG.sectorsCount;
    const angle = (this.pointer?.angle ?? 0) - POINTER_CONFIG.initialAngleDeg;

    this.selectedSectorNumber = Math.min(
      Math.trunc(angle / sectorDeg + 1),
      BAR_CONFIG.sectorsCount
    ) as RewardNumber;

    const targetAngle =
      (this.selectedSectorNumber - 1) * sectorDeg + sectorDeg / 2;

    return tweenToPromise(this.scene, {
      targets: this.pointer,
      angle:
        targetAngle > angle
          ? `+=${targetAngle - angle}`
          : `-=${angle - targetAngle}`,
      ...POINTER_CONFIG.endTween,
    });
  }
}
