import Phaser from "phaser";
import { INTRO_ONBOARDING_UI } from "../config/tuning";

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  create() {
    const { width, height } = this.scale;
    this.input.enabled = true;

    const bg = this.add.image(width / 2, height / 2, "start-bg");
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);
    this.add
      .rectangle(0, 0, width, height, 0x000000, INTRO_ONBOARDING_UI.dimAlpha)
      .setOrigin(0, 0)
      .setDepth(INTRO_ONBOARDING_UI.overlayDepth);

    const onboardingWindow = this.add
      .image(width / 2, height * INTRO_ONBOARDING_UI.windowYRatio, "onboarding-window")
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

    const buttonWidth = Math.max(1, Math.round(width * INTRO_ONBOARDING_UI.buttonWidthRatio));
    const buttonHeight = Math.max(1, Math.round(INTRO_ONBOARDING_UI.buttonHeightPx));
    const windowBottom = onboardingWindow.getBounds().bottom;
    const buttonY = Math.min(
      windowBottom + INTRO_ONBOARDING_UI.buttonOffsetFromWindowPx + buttonHeight / 2,
      height - INTRO_ONBOARDING_UI.buttonBottomPaddingPx - buttonHeight / 2
    );
    const buttonX = width / 2;

    const buttonGraphics = this.add.graphics().setDepth(INTRO_ONBOARDING_UI.buttonDepth);
    const buttonText = this.add
      .text(buttonX, buttonY, INTRO_ONBOARDING_UI.buttonText, {
        fontFamily: INTRO_ONBOARDING_UI.buttonTextFontFamily,
        fontSize: `${INTRO_ONBOARDING_UI.buttonTextFontSizePx}px`,
        fontStyle: INTRO_ONBOARDING_UI.buttonTextStyle,
        color: INTRO_ONBOARDING_UI.buttonTextColor,
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setDepth(INTRO_ONBOARDING_UI.buttonDepth + 1);

    const drawButton = (fillColor: number) => {
      buttonGraphics.clear();
      if (INTRO_ONBOARDING_UI.buttonStrokeWidthPx > 0) {
        buttonGraphics.lineStyle(
          INTRO_ONBOARDING_UI.buttonStrokeWidthPx,
          INTRO_ONBOARDING_UI.buttonStrokeColor,
          1
        );
      }
      buttonGraphics.fillStyle(fillColor, 1);
      const x = buttonX - buttonWidth / 2;
      const y = buttonY - buttonHeight / 2;
      const radius = INTRO_ONBOARDING_UI.buttonRadiusPx;
      buttonGraphics.fillRoundedRect(x, y, buttonWidth, buttonHeight, radius);
      if (INTRO_ONBOARDING_UI.buttonStrokeWidthPx > 0) {
        buttonGraphics.strokeRoundedRect(x, y, buttonWidth, buttonHeight, radius);
      }
    };

    drawButton(INTRO_ONBOARDING_UI.buttonFillColor);

    const buttonHitZone = this.add
      .zone(buttonX, buttonY, buttonWidth, buttonHeight)
      .setOrigin(0.5, 0.5)
      .setDepth(INTRO_ONBOARDING_UI.buttonDepth + 2)
      .setInteractive({ useHandCursor: true });

    let isPressed = false;
    buttonHitZone.on("pointerover", () => {
      if (!isPressed) {
        drawButton(INTRO_ONBOARDING_UI.buttonHoverColor);
      }
    });
    buttonHitZone.on("pointerout", () => {
      isPressed = false;
      drawButton(INTRO_ONBOARDING_UI.buttonFillColor);
    });
    buttonHitZone.on("pointerdown", () => {
      isPressed = true;
      drawButton(INTRO_ONBOARDING_UI.buttonPressedColor);
    });
    buttonHitZone.on("pointerup", () => {
      drawButton(INTRO_ONBOARDING_UI.buttonHoverColor);
      this.scene.start("Game");
    });
  }
}
