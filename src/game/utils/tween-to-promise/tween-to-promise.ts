import * as Phaser from 'phaser';

export const tweenToPromise = (
  scene: Phaser.Scene,
  config: Phaser.Types.Tweens.TweenBuilderConfig
): Promise<Phaser.Tweens.Tween> =>
  new Promise((resolve) => {
    const tween = scene.tweens.add({
      ...config,
      onComplete: (...args) => {
        config.onComplete?.(...args);

        resolve(tween);
      },
    });
  });
