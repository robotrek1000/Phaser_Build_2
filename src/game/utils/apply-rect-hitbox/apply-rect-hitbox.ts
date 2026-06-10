import * as Phaser from 'phaser';

import type { ApplyRectHitboxConfig } from './apply-rect-hitbox.types';

export const applyRectHitbox = (
  sprite: Phaser.Physics.Arcade.Sprite | Phaser.Physics.Arcade.Image,
  config: ApplyRectHitboxConfig
) => {
  const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;

  if (!body) {
    return;
  }
  const sourceWidth = sprite.width;
  const sourceHeight = sprite.height;

  const bodyWidth = Math.round(sourceWidth * config.widthRatio);
  const bodyHeight = Math.round(sourceHeight * config.heightRatio);

  body.setSize(bodyWidth, bodyHeight);
  body.setOffset(
    Math.round((sourceWidth - bodyWidth) / 2),
    Math.round((sourceHeight - bodyHeight) / 2)
  );
};
