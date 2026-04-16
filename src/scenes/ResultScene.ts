import Phaser from "phaser";

import { RESULT_SCREEN_UI } from "../config/tuning";

type ResultReason = "out_of_time" | "assets_empty" | "success_harbor_610";

type ResultPayload = {
  distanceM?: number;
  reason?: ResultReason;
  reachedHarbor?: boolean;
  tier?: 1 | 2 | 3;
  assetsFill?: number;
  yachtCoins?: number;
  portfolioCoins?: number;
  wheelCoins?: number;
  totalCoins?: number;
};

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super("Result");
  }

  create(data?: ResultPayload) {
    const { width, height } = this.scale;
    const cfg = RESULT_SCREEN_UI;

    this.add.rectangle(0, 0, width, height, cfg.panelColor).setOrigin(0, 0);

    const reason = data?.reason ?? "out_of_time";
    const reachedHarbor = data?.reachedHarbor ?? reason === "success_harbor_610";
    const tier = Phaser.Math.Clamp(data?.tier ?? 1, 1, 3);
    const assetsFill = Phaser.Math.Clamp(data?.assetsFill ?? 0, 0, 1);
    const distanceValue = Math.floor(data?.distanceM ?? 0);

    const yachtCoins = Math.max(0, Math.floor(data?.yachtCoins ?? 0));
    const portfolioCoins = Math.max(0, Math.floor(data?.portfolioCoins ?? 0));
    const wheelCoins = Math.max(0, Math.floor(data?.wheelCoins ?? 0));
    const totalCoins = Math.max(0, Math.floor(data?.totalCoins ?? 0));

    const title = reachedHarbor ? "УРОВЕНЬ ПРОЙДЕН" : "УРОВЕНЬ НЕ ПРОЙДЕН";
    const subtitle = reachedHarbor
      ? `Гавань достигнута • Яхта ${tier}`
      : reason === "assets_empty"
        ? "Портфель опустел до нуля"
        : "Время вышло";

    this.add.text(width / 2, height * cfg.titleYRatio, title, {
      fontFamily: cfg.fontFamily,
      fontSize: `${cfg.titleFontSizePx}px`,
      color: cfg.titleColor,
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height * cfg.subtitleYRatio, subtitle, {
      fontFamily: cfg.fontFamily,
      fontSize: `${cfg.subtitleFontSizePx}px`,
      color: reachedHarbor ? cfg.successColor : cfg.failColor,
    }).setOrigin(0.5, 0.5);

    this.add.text(width / 2, height * cfg.distanceYRatio, `Дистанция: ${distanceValue} м`, {
      fontFamily: cfg.fontFamily,
      fontSize: `${cfg.smallFontSizePx}px`,
      color: cfg.bodyColor,
    }).setOrigin(0.5, 0.5);

    const tableWidth = width * cfg.tableWidthRatio;
    const tableHeight = cfg.tableHeightPx;
    const tableX = (width - tableWidth) / 2;
    const tableY = height * cfg.tableTopYRatio;
    const colWidth = tableWidth / 3;
    const rowHeaderY = tableY + cfg.tableRowHeightPx * 0.5;
    const rowValueY = tableY + cfg.tableRowHeightPx * 1.5;
    const rowHintY = tableY + cfg.tableRowHeightPx * 2.5;

    const grid = this.add.graphics();
    grid.fillStyle(0x000000, 0.16);
    grid.fillRoundedRect(tableX, tableY, tableWidth, tableHeight, 12);
    grid.lineStyle(cfg.gridStrokeWidthPx, cfg.gridStrokeColor, 1);
    grid.strokeRoundedRect(tableX, tableY, tableWidth, tableHeight, 12);
    grid.lineBetween(tableX + colWidth, tableY, tableX + colWidth, tableY + tableHeight);
    grid.lineBetween(tableX + colWidth * 2, tableY, tableX + colWidth * 2, tableY + tableHeight);
    grid.lineBetween(tableX, tableY + cfg.tableRowHeightPx, tableX + tableWidth, tableY + cfg.tableRowHeightPx);
    grid.lineBetween(tableX, tableY + cfg.tableRowHeightPx * 2, tableX + tableWidth, tableY + cfg.tableRowHeightPx * 2);

    const headers = ["Ваша яхта", "Ваш портфель", "Колесо"];
    const values = [`+${yachtCoins}`, `+${portfolioCoins}`, `+${wheelCoins}`];
    const hints = [
      `Уровень: ${tier}`,
      `Заполнение: ${Math.floor(assetsFill * 100)}%`,
      "+10 за каждое выпадение",
    ];

    for (let i = 0; i < 3; i += 1) {
      const centerX = tableX + colWidth * (i + 0.5);
      this.add.text(centerX, rowHeaderY, headers[i] ?? "", {
        fontFamily: cfg.fontFamily,
        fontSize: `${cfg.cellHeaderFontSizePx}px`,
        color: cfg.bodyColor,
        align: "center",
      }).setOrigin(0.5, 0.5);

      this.add.text(centerX, rowValueY, values[i] ?? "", {
        fontFamily: cfg.fontFamily,
        fontSize: `${cfg.cellValueFontSizePx}px`,
        color: cfg.coinsColor,
        align: "center",
      }).setOrigin(0.5, 0.5);

      this.add.text(centerX, rowHintY, hints[i] ?? "", {
        fontFamily: cfg.fontFamily,
        fontSize: `${cfg.smallFontSizePx}px`,
        color: cfg.bodyColor,
        align: "center",
      }).setOrigin(0.5, 0.5);
    }

    const totalLabel = reachedHarbor ? `Итого: ${totalCoins} монет` : "Итого: 0 монет";
    this.add.text(width / 2, height * cfg.totalYRatio, totalLabel, {
      fontFamily: cfg.fontFamily,
      fontSize: `${cfg.bodyFontSizePx}px`,
      color: reachedHarbor ? cfg.successColor : cfg.failColor,
      align: "center",
    }).setOrigin(0.5, 0.5);

    if (!reachedHarbor) {
      this.add.text(width / 2, height * cfg.noteYRatio, "Монеты не начислены: гавань не достигнута", {
        fontFamily: cfg.fontFamily,
        fontSize: `${cfg.smallFontSizePx}px`,
        color: cfg.noteFailColor,
        align: "center",
      }).setOrigin(0.5, 0.5);
    }

    const okButton = this.add.text(width / 2, height * cfg.buttonYRatio, cfg.buttonLabel, {
      fontFamily: cfg.fontFamily,
      fontSize: `${cfg.buttonFontSizePx}px`,
      color: cfg.buttonTextColor,
      backgroundColor: cfg.buttonBackgroundColor,
      padding: { x: cfg.buttonPaddingX, y: cfg.buttonPaddingY },
    }).setOrigin(0.5, 0.5);

    okButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.stop("Game");
      this.scene.start("Intro");
    });
  }
}
