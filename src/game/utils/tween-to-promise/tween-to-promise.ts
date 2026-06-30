import { Scene, Tweens, type Types } from 'phaser';

export const tweenToPromise = (
  scene: Scene,
  config: Types.Tweens.TweenBuilderConfig
): Promise<Tweens.Tween> =>
  new Promise((resolve) => {
    const tween = scene.tweens.add({
      ...config,
      onComplete: (...args) => {
        config.onComplete?.(...args);

        resolve(tween);
      },
    });
  });
