import Phaser from "phaser";

import { UI_BUTTON, UI_TEXT } from "../config/tuning";

type ResultReason = "out_of_assets" | "out_of_time" | "success_island_200" | "success_tavern_400" | "success_harbor_610";

type ResultPayload = {
  distanceM?: number;
  coinsAwarded?: number;
  coinsLost?: number;
  reason?: ResultReason;
};

export default class ResultScene extends Phaser.Scene {
  private distanceText?: Phaser.GameObjects.Text;
  private coinsText?: Phaser.GameObjects.Text;
  private reasonText?: Phaser.GameObjects.Text;
  private lostCoinsText?: Phaser.GameObjects.Text;

  constructor() {
    super("Result");
  }

  create(data?: ResultPayload) {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x1a1f2b).setOrigin(0, 0);

    const distanceValue = Math.floor(data?.distanceM ?? 0);
    const coinsAwarded = data?.coinsAwarded ?? 0;
    const coinsLost = data?.coinsLost ?? 0;
    const reason = data?.reason ?? "out_of_assets";
    const isSuccess = reason === "success_island_200" || reason === "success_tavern_400" || reason === "success_harbor_610";

    const title = isSuccess ? "Уровень пройден" : "Результат";
    let reasonLabel = "Активы закончились";
    if (reason === "out_of_time") {
      reasonLabel = "Время вышло";
    } else if (reason === "success_island_200") {
      reasonLabel = "Финиш: необитаемый остров";
    } else if (reason === "success_tavern_400") {
      reasonLabel = "Финиш: остров с таверной";
    } else if (reason === "success_harbor_610") {
      reasonLabel = "Финал: гавань";
    }

    this.add.text(width / 2, height * 0.35, title, {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.resultTitleSize,
      color: UI_TEXT.resultTitleColor,
    }).setOrigin(0.5, 0.5);

    this.distanceText = this.add.text(width / 2, height * 0.45, `${distanceValue} м`, {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.resultBodySize,
      color: UI_TEXT.resultBodyColor,
    }).setOrigin(0.5, 0.5);

    const coinsLabel = isSuccess ? `Начислено монет: ${coinsAwarded}` : "Начислено монет: 0";
    this.coinsText = this.add.text(width / 2, height * 0.52, coinsLabel, {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.resultBodySize,
      color: UI_TEXT.resultCoinsColor,
    }).setOrigin(0.5, 0.5);

    this.reasonText = this.add.text(width / 2, height * 0.58, reasonLabel, {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.resultSmallSize,
      color: UI_TEXT.resultBodyColor,
    }).setOrigin(0.5, 0.5);

    if (!isSuccess && coinsLost > 0) {
      this.lostCoinsText = this.add.text(width / 2, height * 0.64, `Утеряно монет: ${coinsLost}`, {
        fontFamily: UI_TEXT.hudFontFamily,
        fontSize: UI_TEXT.resultSmallSize,
        color: UI_TEXT.resultBodyColor,
      }).setOrigin(0.5, 0.5);
    }

    const okButton = this.add.text(width / 2, height * 0.72, "ОТЛИЧНО", {
      fontFamily: UI_BUTTON.fontFamily,
      fontSize: UI_BUTTON.fontSize,
      color: UI_BUTTON.color,
      backgroundColor: UI_BUTTON.backgroundColor,
      padding: { x: UI_BUTTON.paddingX, y: UI_BUTTON.paddingY },
    }).setOrigin(0.5, 0.5);

    okButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.stop("Game");
      this.scene.start("Intro");
    });
  }
}
