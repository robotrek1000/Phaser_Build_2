import Phaser from "phaser";
import { INTRO_LAYOUT, UI_TEXT } from "../config/tuning";

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
    this.add.rectangle(0, 0, width, height, 0x000000, INTRO_LAYOUT.dimAlpha).setOrigin(0, 0);

    this.add.text(width / 2, height * INTRO_LAYOUT.textYRatio, "Управляйте яхтой с помощью свайпа", {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: INTRO_LAYOUT.textSize,
      color: "#e8f1f2",
      align: "center",
    }).setOrigin(0.5, 0.5);

    const hand = this.add.image(width * INTRO_LAYOUT.handStartRatio, height * INTRO_LAYOUT.handYRatio, "hand-icon");
    hand.setScale(INTRO_LAYOUT.handScale);
    this.tweens.add({
      targets: hand,
      x: width * INTRO_LAYOUT.handEndRatio,
      duration: INTRO_LAYOUT.handDurationMs,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    const startButton = this.add.image(width / 2, height * INTRO_LAYOUT.buttonYRatio, "start-button");
    startButton.setScale(INTRO_LAYOUT.buttonScale);
    startButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
