import Phaser from "phaser";
import BootloaderScene from "./scenes/BootloaderScene";
import GameScene from "./scenes/GameScene";
import IntroScene from "./scenes/IntroScene";
import ResultScene from "./scenes/ResultScene";

const syncAppViewportHeight = () => {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
};

window.addEventListener("load", () => {
  syncAppViewportHeight();

  const game = new Phaser.Game({
    width: 720,
    height: 1280,
    backgroundColor: "#2f2f2f",
    parent: "game-container",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    },
    scene: [BootloaderScene, IntroScene, GameScene, ResultScene],
  });

  const refreshViewportAndScale = () => {
    syncAppViewportHeight();
    game.scale.refresh();
  };

  window.addEventListener("resize", refreshViewportAndScale);
  window.addEventListener("orientationchange", refreshViewportAndScale);
  window.visualViewport?.addEventListener("resize", refreshViewportAndScale);
  window.visualViewport?.addEventListener("scroll", refreshViewportAndScale);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  }

  game.scene.start("Bootloader");
});
