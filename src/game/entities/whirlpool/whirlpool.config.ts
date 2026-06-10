import type { BaseSpawnedObjectConfig } from '../base-spawned-object';
import type { ApplyRectHitboxConfig } from '@/game/utils';

import { NEW_ASSET_KEYS } from '@/game/asset-keys.config';

export const WHIRLPOOL_CONFIG: BaseSpawnedObjectConfig = {
  textureKey: {
    1: NEW_ASSET_KEYS.level1.whirlpool,
    2: NEW_ASSET_KEYS.level2.whirlpool,
    3: NEW_ASSET_KEYS.level3.whirlpool,
  },
  width: 120,
  height: 68,
  depth: 12,
  speedYMultiplier: 1,
  allowGravity: false,
  immovable: true,
  alpha: 1,
  rotation: 0,
  scale: 1,
};

export const WHIRLPOOL_HITBOX_CONFIG: ApplyRectHitboxConfig = {
  widthRatio: 0.8,
  heightRatio: 0.8,
};

export const WHIRLPOOL_PULSE_CONFIG = {
  minScale: 0.5,
  maxScale: 1.3,
  duration: 900,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
} as const;
