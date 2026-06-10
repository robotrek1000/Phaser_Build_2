import * as Phaser from 'phaser';

import { BLINK_TWEEN_CONFIG } from './play-blink-animation.config';

import type { BlinkAnimationConfig } from './play-blink-animation.types';

export const playBlinkAnimation = (
  target: Phaser.Physics.Arcade.Image,
  config: BlinkAnimationConfig
) => {
  const fromColor = new Phaser.Display.Color(255, 255, 255);
  const toColor = Phaser.Display.Color.ValueToColor(config.tintColor);
  const blendState = { t: 0 };

  target.setAlpha(1);

  return target.scene.tweens.add({
    targets: blendState,
    t: config.tintStrength,
    duration: config.duration,
    ...BLINK_TWEEN_CONFIG,
    onUpdate: () => {
      if (!target) {
        return;
      }

      const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(
        fromColor,
        toColor,
        100,
        Math.round(blendState.t * 100)
      );

      const tint = Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);

      target.setTint(tint);
      target.setAlpha(Phaser.Math.Linear(1, config.alphaMin, blendState.t));
    },
  });
};
