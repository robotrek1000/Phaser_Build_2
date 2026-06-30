import { Tweens } from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  WHIRLPOOL_CONFIG,
  WHIRLPOOL_HITBOX_CONFIG,
  WHIRLPOOL_PULSE_CONFIG,
} from './whirlpool.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { GameState } from '@/game/system/game-state';
import { applyRectHitbox } from '@/game/utils';

export class Whirlpool extends BaseSpawnedObject {
  protected config = WHIRLPOOL_CONFIG;

  private pulseTween?: Tweens.Tween;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRectHitbox(this, WHIRLPOOL_HITBOX_CONFIG);

    const baseScaleX = this.scaleX;
    const baseScaleY = this.scaleY;
    const { maxScale, minScale, ...pulseTweenConfig } = WHIRLPOOL_PULSE_CONFIG;

    this.setScale(baseScaleX * minScale, baseScaleY * minScale);

    this.pulseTween = this.scene.tweens.add({
      targets: this,
      scaleX: baseScaleX * maxScale,
      scaleY: baseScaleY * maxScale,
      ...pulseTweenConfig,
    });
  }

  async despawn() {
    this.pulseTween?.stop();

    this.pulseTween = undefined;

    return super.despawn();
  }
}
