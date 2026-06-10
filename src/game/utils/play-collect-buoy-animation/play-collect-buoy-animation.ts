import * as Phaser from 'phaser';

import { tweenToPromise } from '../tween-to-promise';

export const playCollectBuoyAnimation = async (
  player: Phaser.Physics.Arcade.Image,
  buoy: Phaser.Physics.Arcade.Sprite
) => {
  if (!player?.active) {
    buoy.setAlpha(0);
    return;
  }

  const startX = buoy.x;
  const startY = buoy.y;
  const startScaleX = buoy.scaleX;
  const startScaleY = buoy.scaleY;

  const state = { t: 0 };

  const arcOffsetX = Phaser.Math.Between(-60, 60);
  const arcOffsetY = -Phaser.Math.Between(40, 110);

  return tweenToPromise(buoy.scene, {
    targets: state,
    t: 1,
    duration: 380,
    ease: 'Sine.easeInOut',
    onUpdate: () => {
      const t = state.t;

      const endX = player.x;
      const endY = player.y;
      const midX = (startX + endX) * 0.5 + arcOffsetX;
      const midY = Math.min(startY, endY) + arcOffsetY;

      const ax = Phaser.Math.Linear(startX, midX, t);
      const ay = Phaser.Math.Linear(startY, midY, t);
      const bx = Phaser.Math.Linear(midX, endX, t);
      const by = Phaser.Math.Linear(midY, endY, t);

      buoy.x = Phaser.Math.Linear(ax, bx, t);
      buoy.y = Phaser.Math.Linear(ay, by, t);

      const scaleFactor = Phaser.Math.Linear(1, 0, t);
      buoy.setScale(startScaleX * scaleFactor, startScaleY * scaleFactor);
      buoy.setAlpha(Phaser.Math.Linear(1, 0, t));
    },
  });
};
