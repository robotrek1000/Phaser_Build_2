import type { AttractMotionConfig } from '@/game/motions/attract-motion';

export const MONEY_DOWN_MAGNET_ATTRACT_MOTION_CONFIG: AttractMotionConfig = {
  radius: 640,
  forcePxPerSec: 500,
  falloffPower: 0.7,
  maxPullSpeedXPxPerSec: 360,
  maxPullSpeedYPxPerSec: 260,
  minDistancePx: 12,
  axisFactorX: 1.15,
  axisFactorY: 0.82,
  tangentialDamping: 0.9,
  disableMagnetViewportBottomPaddingPx: 140,
};
