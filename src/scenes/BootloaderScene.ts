import Phaser from "phaser";

export default class BootloaderScene extends Phaser.Scene {
  private bar?: Phaser.GameObjects.Rectangle;
  private barWidth = 0;
  private barHeight = 18;

  constructor() {
    super("Bootloader");
  }

  preload() {
    const { width, height } = this.scale;
    this.barWidth = Math.floor(width * 0.4);
    const x = (width - this.barWidth) / 2;
    const y = height * 0.55;

    this.add.rectangle(x, y, this.barWidth, this.barHeight, 0x4a4a4a).setOrigin(0, 0);
    this.bar = this.add.rectangle(x, y, 0, this.barHeight, 0xc6c6c6).setOrigin(0, 0);

    this.add.text(width / 2, y - 24, "Loading...", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#e0e0e0",
    }).setOrigin(0.5, 0.5);

    this.load.pack("main-pack", "assets/asset-pack.json");

    this.load.on("progress", (value: number) => {
      if (this.bar) {
        this.bar.width = this.barWidth * value;
      }
    });
  }

  create() {
    this.scene.start("Intro");
  }
}
