import { Math as PhaserMath, Physics } from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  DESPAWN_ANIMATION_CONFIG,
  WHEEL_ISLAND_BODY_Y_OFFSET_PX,
  WHEEL_ISLAND_CONFIG,
  WHEEL_ISLAND_SPAWN_MAX_OFFSET_PX,
} from './wheel-island.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { GameState } from '@/game/system/game-state';
import { tweenToPromise } from '@/game/utils';

export class WheelIsland extends BaseSpawnedObject {
  protected config = WHEEL_ISLAND_CONFIG;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    const body = this.body as Physics.Arcade.Body;

    body.setSize(this.scene.scale.width * 2, 1, false);
    body.setOffset(-this.x, this.height + WHEEL_ISLAND_BODY_Y_OFFSET_PX);
  }

  protected resolveSpawnX(config: SpawnObjectConfig) {
    const playArea = this.playArea;
    const spawnX = super.resolveSpawnX(config);

    return PhaserMath.Clamp(
      spawnX,
      playArea.left - WHEEL_ISLAND_SPAWN_MAX_OFFSET_PX,
      playArea.right + WHEEL_ISLAND_SPAWN_MAX_OFFSET_PX
    );
  }

  protected override async playDespawnAnimation() {
    await tweenToPromise(this.scene, {
      targets: this,
      ...DESPAWN_ANIMATION_CONFIG,
    });
  }
}
