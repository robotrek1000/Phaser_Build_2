import * as Phaser from 'phaser';

import { BaseSpawnedObject } from '../base-spawned-object';

import {
  REEF_CONFIG,
  REEF_HITBOX_CONFIG,
  REEF_PARTIAL_SPAWN_MAX_OFFSET_PX,
} from './reef.config';

import type { SpawnObjectConfig } from '@/game/level-design';

import { GameState } from '@/game/system/game-state';
import { applyRectHitbox } from '@/game/utils';

export class Reef extends BaseSpawnedObject {
  protected config = REEF_CONFIG;

  spawn(config: SpawnObjectConfig, gameState?: GameState) {
    super.spawn(config, gameState);

    applyRectHitbox(this, REEF_HITBOX_CONFIG);
  }

  protected resolveSpawnX(item: SpawnObjectConfig) {
    const playArea = this.playArea;

    const spawnX = super.resolveSpawnX(item);

    return Phaser.Math.Clamp(
      spawnX,
      playArea.left - REEF_PARTIAL_SPAWN_MAX_OFFSET_PX,
      playArea.right + REEF_PARTIAL_SPAWN_MAX_OFFSET_PX
    );
  }
}
