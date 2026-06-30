import { Scene } from 'phaser';

import { GAME_EVENT_LOAD_FINISH, GAME_EVENT_LOAD_PROGRESS } from '@/game';
import { ASSETS_PACK_NAME } from '@/game/asset-keys.config';
import { BOOT_SCENE_NAME } from '@/game/scenes/boot-scene';

export class BootScene extends Scene {
  constructor() {
    super(BOOT_SCENE_NAME);
  }

  preload() {
    this.load.on('progress', (value: number) => {
      this.game.events.emit(GAME_EVENT_LOAD_PROGRESS, value);
    });
    this.load.pack(ASSETS_PACK_NAME, 'asset-pack.json');
  }

  create() {
    this.game.events.emit(GAME_EVENT_LOAD_FINISH);
  }
}
