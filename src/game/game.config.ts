import * as Phaser from 'phaser';

import type { GameEvent } from './game.types';
import type { SkillWheelFixedBonuses } from '@/game/system/game-state';

import { BootScene } from '@/game/scenes/boot-scene';
import { GameScene } from '@/game/scenes/game-scene';
import { scaled } from '@/game/utils';
import { DESIGN_HEIGHT, DESIGN_WIDTH } from '@/shared/constants';

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: scaled(DESIGN_WIDTH),
  height: scaled(DESIGN_HEIGHT),
  backgroundColor: '#0a4261',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: scaled(DESIGN_WIDTH),
    height: scaled(DESIGN_HEIGHT),
    autoRound: true,
  },

  render: {
    antialias: true,
    roundPixels: false,
  },

  pixelArt: false,

  scene: [BootScene, GameScene],
};

export const GAME_EVENT_LOAD_FINISH: GameEvent = 'loadFinish';

export const GAME_EVENT_LOAD_PROGRESS: GameEvent = 'loadProgress';

export const GAME_EVENT_GAME_READY: GameEvent = 'gameReady';

export const GAME_EVENT_UPDATE_SETTINGS: GameEvent = 'updateSettings';

export const GAME_EVENT_REACH_ISLAND: GameEvent = 'reachIsland';

export const GAME_EVENT_GAME_STATE_UPDATE: GameEvent = 'gameStateUpdate';

export const GAME_EVENT_FINISH: GameEvent = 'finish';

export const FIXED_BONUSES: Record<SkillWheelFixedBonuses, number> = {
  time: 15,
  coins: 10,
};
