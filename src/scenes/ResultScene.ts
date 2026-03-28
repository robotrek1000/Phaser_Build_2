import Phaser from "phaser";

import { RESULT_SCREEN_UI } from "../config/tuning";

type ResultReason = "out_of_time" | "hit_hazard" | "success_harbor_610";

type ResultPayload = {
  distanceM?: number;
  coinsAwarded?: number;
  coinsLost?: number;
  reason?: ResultReason;
};

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  create(data?: ResultPayload) {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x1a1f2b).setOrigin(0, 0);

    const distanceValue = Math.floor(data?.distanceM ?? 0);
    const coinsAwarded = data?.coinsAwarded ?? 0;
    const coinsLost = data?.coinsLost ?? 0;
    const reason = data?.reason ?? "out_of_time";
    const isSuccess = reason === "success_harbor_610";

    const title = isSuccess ? "Уровень пройден" : "Результат";
    let reasonLabel = "Время вышло";
    if (reason === "success_harbor_610") {
      reasonLabel = "Финал: гавань";
    } else if (reason === "hit_hazard") {
      reasonLabel = "Столкновение с опасностью";
    }

    this.add.text(width / 2, height * RESULT_SCREEN_UI.titleYRatio, title, {
      fontFamily: RESULT_SCREEN_UI.fontFamily,
      fontSize: `${RESULT_SCREEN_UI.titleFontSizePx}px`,
      color: RESULT_SCREEN_UI.titleColor,
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height * RESULT_SCREEN_UI.distanceYRatio, `${distanceValue} м`, {
      fontFamily: RESULT_SCREEN_UI.fontFamily,
      fontSize: `${RESULT_SCREEN_UI.bodyFontSizePx}px`,
      color: RESULT_SCREEN_UI.bodyColor,
    }).setOrigin(0.5, 0.5);

    const coinsLabel = `Начислено монет: ${coinsAwarded}`;
    this.add.text(width / 2, height * RESULT_SCREEN_UI.coinsYRatio, coinsLabel, {
      fontFamily: RESULT_SCREEN_UI.fontFamily,
      fontSize: `${RESULT_SCREEN_UI.bodyFontSizePx}px`,
      color: RESULT_SCREEN_UI.coinsColor,
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height * RESULT_SCREEN_UI.reasonYRatio, reasonLabel, {
      fontFamily: RESULT_SCREEN_UI.fontFamily,
      fontSize: `${RESULT_SCREEN_UI.smallFontSizePx}px`,
      color: RESULT_SCREEN_UI.bodyColor,
    }).setOrigin(0.5, 0.5);

    if (!isSuccess && coinsLost > 0) {
      this.add.text(width / 2, height * RESULT_SCREEN_UI.lostCoinsYRatio, `Утеряно монет: ${coinsLost}`, {
        fontFamily: RESULT_SCREEN_UI.fontFamily,
        fontSize: `${RESULT_SCREEN_UI.smallFontSizePx}px`,
        color: RESULT_SCREEN_UI.bodyColor,
      }).setOrigin(0.5, 0.5);
    }

    const okButton = this.add.text(width / 2, height * RESULT_SCREEN_UI.buttonYRatio, RESULT_SCREEN_UI.buttonLabel, {
      fontFamily: RESULT_SCREEN_UI.fontFamily,
      fontSize: `${RESULT_SCREEN_UI.buttonFontSizePx}px`,
      color: RESULT_SCREEN_UI.buttonTextColor,
      backgroundColor: RESULT_SCREEN_UI.buttonBackgroundColor,
      padding: { x: RESULT_SCREEN_UI.buttonPaddingX, y: RESULT_SCREEN_UI.buttonPaddingY },
    }).setOrigin(0.5, 0.5);

    okButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.stop("Game");
      this.scene.start("Intro");
    });
  }
}
