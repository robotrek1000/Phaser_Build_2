import Phaser from "phaser";
import { INTRO_ONBOARDING_UI } from "../config/tuning";

export default class IntroScene extends Phaser.Scene {
  private continueText?: Phaser.GameObjects.Text;
  private continuePulsePhase = 0;
  private isStartingGame = false;

  constructor() {
    super("Intro");
  }

  create() {
    const { width, height } = this.scale;
    const uiScale = Phaser.Math.Clamp(Math.min(width / 864, height / 1536), 0.46, 1);
    this.input.enabled = true;

    const bg = this.add.image(width / 2, height / 2, "start-bg");
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);
    this.add
      .rectangle(0, 0, width, height, 0x000000, INTRO_ONBOARDING_UI.dimAlpha)
      .setOrigin(0, 0)
      .setDepth(INTRO_ONBOARDING_UI.overlayDepth);

    const onboardingWindow = this.add
      .image(width / 2, height * INTRO_ONBOARDING_UI.windowYRatio, "onboarding-window-3")
      .setDepth(INTRO_ONBOARDING_UI.windowDepth);
    const fitScale = Math.min(
      (width * INTRO_ONBOARDING_UI.windowMaxWidthRatio) / onboardingWindow.width,
      (height * INTRO_ONBOARDING_UI.windowMaxHeightRatio) / onboardingWindow.height
    );
    const clampedScale = Phaser.Math.Clamp(
      fitScale,
      INTRO_ONBOARDING_UI.windowMinScale,
      INTRO_ONBOARDING_UI.windowMaxScale
    );
    onboardingWindow.setScale(clampedScale);

    const continueFontSizePx = Math.max(18, Math.round(INTRO_ONBOARDING_UI.continueFontSizePx * uiScale));
    const continueY = height - INTRO_ONBOARDING_UI.continueBottomInsetPx;
    this.continueText = this.add
      .text(width / 2, continueY, INTRO_ONBOARDING_UI.continueText, {
        fontFamily: INTRO_ONBOARDING_UI.continueFontFamily,
        fontSize: `${continueFontSizePx}px`,
        fontStyle: "bold",
        color: INTRO_ONBOARDING_UI.continueColor,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(INTRO_ONBOARDING_UI.continueDepth)
      .setAlpha(INTRO_ONBOARDING_UI.continueAlpha);

    this.input.once("pointerdown", () => {
      this.startGame();
    });
  }

  update(_time: number, delta: number) {
    if (!this.continueText || !this.continueText.active) {
      return;
    }
    const pulseHz = Math.max(0, INTRO_ONBOARDING_UI.continuePulseHz);
    this.continuePulsePhase += (delta / 1000) * pulseHz * Math.PI * 2;
    const wave = 0.5 + Math.sin(this.continuePulsePhase) * 0.5;
    const alpha = Phaser.Math.Linear(
      INTRO_ONBOARDING_UI.continuePulseMinAlpha,
      INTRO_ONBOARDING_UI.continueAlpha,
      wave,
    );
    this.continueText.setAlpha(alpha);
  }

  private startGame() {
    if (this.isStartingGame) {
      return;
    }
    this.isStartingGame = true;
    this.scene.start("Game");
  }
}
