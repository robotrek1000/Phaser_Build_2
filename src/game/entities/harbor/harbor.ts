import { Math as PhaserMath, Physics } from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  HARBOR_BODY_Y_OFFSET_PX,
  HARBOR_CONFIG,
  HARBOR_PARTIAL_SPAWN_MAX_OFFSET_PX,
} from './harbor.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { GameState } from '@/game/system/game-state';
import { scaled } from '@/game/utils';

export class Harbor extends BaseSpawnedObject {
  protected config = HARBOR_CONFIG;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    const body = this.body as Physics.Arcade.Body;

    body.setSize(this.scene.scale.width * 2, 1, false);
    body.setOffset(-this.x, this.height + scaled(HARBOR_BODY_Y_OFFSET_PX));
  }

  protected resolveSpawnX(config: SpawnObjectConfig) {
    const playArea = this.playArea;
    const spawnX = super.resolveSpawnX(config);

    return PhaserMath.Clamp(
      spawnX,
      playArea.left - HARBOR_PARTIAL_SPAWN_MAX_OFFSET_PX,
      playArea.right + HARBOR_PARTIAL_SPAWN_MAX_OFFSET_PX
    );
  }
}
