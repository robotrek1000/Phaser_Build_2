import { Physics } from 'phaser';

import { tweenToPromise } from '../tween-to-promise';

import { PLAY_BUOY_IMPACT_ANIMATION_CONFIG } from './play-buoy-impact-animation.config';

export const playBuoyImpactAnimation = async (buoy: Physics.Arcade.Sprite) => {
  const startScaleX = buoy.scaleX;
  const startScaleY = buoy.scaleY;

  const { rotationDelta, scaleUp, scaleDown, duration, easeUp, easeDown } =
    PLAY_BUOY_IMPACT_ANIMATION_CONFIG;

  const scaleUpDuration = duration * 0.35;
  const scaleDownDuration = duration - scaleUpDuration;

  void tweenToPromise(buoy.scene, {
    targets: buoy,
    rotation: buoy.rotation + rotationDelta,
    duration,
    ease: easeUp,
  });

  await tweenToPromise(buoy.scene, {
    targets: buoy,
    scaleX: startScaleX * scaleUp,
    scaleY: startScaleY * scaleUp,
    duration: scaleUpDuration,
    ease: easeUp,
  });

  await tweenToPromise(buoy.scene, {
    targets: buoy,
    scaleX: startScaleX * scaleDown,
    scaleY: startScaleY * scaleDown,
    alpha: 0,
    duration: scaleDownDuration,
    ease: easeDown,
  });
};
