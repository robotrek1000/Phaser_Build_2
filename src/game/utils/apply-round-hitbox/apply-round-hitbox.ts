import { Physics } from 'phaser';

export const applyRoundHitbox = (
  sprite: Physics.Arcade.Sprite,
  radiusRatio: number
) => {
  const body = sprite.body as Physics.Arcade.Body | undefined;

  if (!body) {
    return;
  }

  const radius = Math.min(sprite.width, sprite.height) * radiusRatio;

  body.setCircle(radius);

  body.setOffset(
    (sprite.width - radius * 2) / 2,
    (sprite.height - radius * 2) / 2
  );
};
