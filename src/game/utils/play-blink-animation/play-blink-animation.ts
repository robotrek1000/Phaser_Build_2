import { Display, Math as PhaserMath, Physics } from 'phaser';

import { BLINK_TWEEN_CONFIG } from './play-blink-animation.config';

import type { BlinkAnimationConfig } from './play-blink-animation.types';

export const playBlinkAnimation = (
  target: Physics.Arcade.Image,
  config: BlinkAnimationConfig
) => {
  const fromColor = new Display.Color(255, 255, 255);
  const toColor = Display.Color.ValueToColor(config.tintColor);
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

      const mixed = Display.Color.Interpolate.ColorWithColor(
        fromColor,
        toColor,
        100,
        Math.round(blendState.t * 100)
      );

      const tint = Display.Color.GetColor(mixed.r, mixed.g, mixed.b);

      target.setTint(tint);
      target.setAlpha(PhaserMath.Linear(1, config.alphaMin, blendState.t));
    },
  });
};
