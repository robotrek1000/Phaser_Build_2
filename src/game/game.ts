import * as Phaser from 'phaser';

import {
  GAME_CONFIG,
  GAME_EVENT_FINISH,
  GAME_EVENT_GAME_READY,
  GAME_EVENT_GAME_STATE_UPDATE,
  GAME_EVENT_LOAD_FINISH,
  GAME_EVENT_LOAD_PROGRESS,
  GAME_EVENT_REACH_ISLAND,
} from './game.config';
import { BOOT_SCENE_NAME } from './scenes/boot-scene';

import type { GameEvent, GameEventMap } from './game.types';
import type { GameSettings } from '@/game/level-design';
import type { SkillWheelBonus } from '@/game/system/game-state';

import { GAME_SCENE_NAME, GameScene } from '@/game/scenes/game-scene';

export class Game {
  private game: Phaser.Game;

  private gameSettings?: GameSettings;

  private events = new Phaser.Events.EventEmitter();

  private isLoaded = false;

  private isReady = false;

  private get gameScene() {
    return this.game.scene.getScene(GAME_SCENE_NAME) as GameScene | undefined;
  }

  constructor(parent: string | HTMLElement) {
    this.game = new Phaser.Game({
      ...GAME_CONFIG,
      parent,
    });

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

    this.game.events.once(GAME_EVENT_LOAD_FINISH, () => {
      this.isLoaded = true;

      this.events.emit(GAME_EVENT_LOAD_FINISH);
    });
  }

  load() {
    this.game.scene.start(BOOT_SCENE_NAME);
  }

  setSettings(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;

    this.initGameScene();
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
