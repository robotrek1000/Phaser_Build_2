import { Events, Game as PhaserGame } from 'phaser';

import {
  GAME_CONFIG,
  GAME_EVENT_FINISH,
  GAME_EVENT_GAME_READY,
  GAME_EVENT_GAME_STATE_UPDATE,
  GAME_EVENT_GAMEPLAY_EVENT,
  GAME_EVENT_LOAD_FINISH,
  GAME_EVENT_LOAD_PROGRESS,
  GAME_EVENT_REACH_ISLAND,
  GAME_EVENT_UPDATE_SETTINGS,
} from './game.config';
import { DEFAULT_GAME_SETTINGS } from './level-design/config';
import { BOOT_SCENE_NAME } from './scenes/boot-scene';

import type { GameEvent, GameEventMap } from './game.types';
import type { GameSettings } from '@/game/level-design';
import type { SkillWheelBonus } from '@/game/system/game-state';

import { GAME_SCENE_NAME, GameScene } from '@/game/scenes/game-scene';
import { SoundManager } from '@/game/system/sound-manager';

export class Game {
  soundManager: SoundManager;

  private game: PhaserGame;

  private gameSettings: GameSettings = DEFAULT_GAME_SETTINGS;

  private gameSessionId?: string;

  private events = new Events.EventEmitter();

  private isLoaded = false;

  private isReady = false;

  private get gameScene() {
    return this.game.scene.getScene(GAME_SCENE_NAME) as GameScene | undefined;
  }

  constructor(parent: string | HTMLElement) {
    this.game = new PhaserGame({
      ...GAME_CONFIG,
      parent,
    });

    this.soundManager = new SoundManager(this.game);

    window.addEventListener('keypress', this.togglePause.bind(this));

    this.game.events.on(
      GAME_EVENT_FINISH,
      (payload: GameEventMap[typeof GAME_EVENT_FINISH]) => {
        this.isReady = false;

        this.events.emit(GAME_EVENT_FINISH, payload);
      }
    );

    this.game.events.on(
      GAME_EVENT_LOAD_PROGRESS,
      (payload: GameEventMap[typeof GAME_EVENT_LOAD_PROGRESS]) => {
        this.events.emit(GAME_EVENT_LOAD_PROGRESS, payload);
      }
    );

    this.game.events.on(
      GAME_EVENT_GAME_READY,
      (payload: GameEventMap[typeof GAME_EVENT_GAME_READY]) => {
        this.isReady = true;

        this.game.pause();

        this.events.emit(GAME_EVENT_GAME_READY, payload);
      }
    );

    this.game.events.on(
      GAME_EVENT_REACH_ISLAND,
      (payload: GameEventMap[typeof GAME_EVENT_REACH_ISLAND]) => {
        this.game.pause();

        this.events.emit(GAME_EVENT_REACH_ISLAND, payload);
      }
    );

    this.game.events.on(
      GAME_EVENT_GAME_STATE_UPDATE,
      (payload: GameEventMap[typeof GAME_EVENT_GAME_STATE_UPDATE]) => {
        this.events.emit(GAME_EVENT_GAME_STATE_UPDATE, payload);
      }
    );

    this.game.events.on(
      GAME_EVENT_GAMEPLAY_EVENT,
      (payload: GameEventMap[typeof GAME_EVENT_GAMEPLAY_EVENT]) => {
        this.events.emit(GAME_EVENT_GAMEPLAY_EVENT, payload);
      }
    );

    this.game.events.once(GAME_EVENT_LOAD_FINISH, () => {
      this.isLoaded = true;

      this.soundManager.create();

      this.events.emit(GAME_EVENT_LOAD_FINISH);
    });
  }

  load() {
    this.game.scene.start(BOOT_SCENE_NAME);
  }

  getSettings() {
    return this.gameSettings;
  }

  setSettings(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;

    this.initGameScene();

    this.events.emit(GAME_EVENT_UPDATE_SETTINGS, this.gameSettings);
  }

  updateSettings(gameSettings: Partial<GameSettings>) {
    this.setSettings({ ...this.gameSettings, ...gameSettings });
  }

  getSessionId() {
    return this.gameSessionId;
  }

  setSessionId(sessionId: string) {
    this.gameSessionId = sessionId;
  }

  resetSessionId() {
    this.gameSessionId = undefined;
  }

  start() {
    if (!this.isLoaded) {
      return;
    }

    if (!this.isReady) {
      this.game.events.once(GAME_EVENT_GAME_READY, () => {
        this.game.resume();
        this.gameScene?.startGame();
      });

      this.initGameScene();

      return;
    }

    this.game.resume();
    this.gameScene?.startGame();
  }

  stop() {
    this.resetSessionId();
    this.initGameScene();
  }

  pause() {
    this.game.pause();
  }

  resume() {
    this.game.resume();
  }

  destroy() {
    this.events.removeAllListeners();
    this.game.destroy(true);
  }

  refreshView() {
    this.game.scale.refresh();
  }

  on<T extends GameEvent>(
    event: T,
    handler: (payload: GameEventMap[T]) => void
  ) {
    this.events.on(event, handler);

    return () => this.events.off(event, handler);
  }

  once<T extends GameEvent>(
    event: T,
    handler: (payload: GameEventMap[T]) => void
  ) {
    this.events.once(event, handler);

    return () => this.events.off(event, handler);
  }

  off<T extends GameEvent>(
    event: T,
    handler: (payload: GameEventMap[T]) => void
  ) {
    this.events.off(event, handler);
  }

  collectBonus(bonus: SkillWheelBonus) {
    this.gameScene?.collectBonus(bonus);
    this.game.resume();
  }

  private initGameScene() {
    this.game.scene.start(GAME_SCENE_NAME, this.gameSettings);
  }

  private togglePause({ key }: KeyboardEvent) {
    if (key == ']') {
      throw new Error('Test error');
    }

    if (key !== ' ') {
      return;
    }

    if (this.game.isPaused) {
      this.game.resume();
      return;
    }

    this.game.pause();
  }
}
