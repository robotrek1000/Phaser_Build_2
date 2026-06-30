import { Math as PhaserMath, Physics } from 'phaser';

import { tweenToPromise } from '../tween-to-promise';

export const playCollectBuoyAnimation = async (
  player: Physics.Arcade.Image,
  buoy: Physics.Arcade.Sprite
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

  const arcOffsetX = PhaserMath.Between(-60, 60);
  const arcOffsetY = -PhaserMath.Between(40, 110);

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

      const ax = PhaserMath.Linear(startX, midX, t);
      const ay = PhaserMath.Linear(startY, midY, t);
      const bx = PhaserMath.Linear(midX, endX, t);
      const by = PhaserMath.Linear(midY, endY, t);

      buoy.x = PhaserMath.Linear(ax, bx, t);
      buoy.y = PhaserMath.Linear(ay, by, t);

      const scaleFactor = PhaserMath.Linear(1, 0, t);
      buoy.setScale(startScaleX * scaleFactor, startScaleY * scaleFactor);
      buoy.setAlpha(PhaserMath.Linear(1, 0, t));
    },
  });
};
