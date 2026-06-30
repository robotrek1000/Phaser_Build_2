import { Scene, Scenes } from 'phaser';

import {
  GAME_SCENE_NAME,
  GAME_SCENE_OBJECT,
  GAME_STATE_UPDATE_INTERVAL_MS,
} from './game-scene.config';

import {
  GAME_EVENT_FINISH,
  GAME_EVENT_GAME_READY,
  GAME_EVENT_GAME_STATE_UPDATE,
} from '@/game';
import { BaseSpawnedObject } from '@/game/entities/base-spawned-object';
import { GlowForeground } from '@/game/entities/glow-foreground';
import { WaterBackground } from '@/game/entities/water-background';
import { Yacht } from '@/game/entities/yacht';
import { type GameSettings, prepareLevel } from '@/game/level-design';
import { CollisionManager } from '@/game/system/collision-manager';
import { GameState, type SkillWheelBonus } from '@/game/system/game-state';
import { SpawnManager } from '@/game/system/spawn-manager';
import {
  prepareGameFinishPayload,
  prepareGameStateUpdatePayload,
} from '@/game/utils';

export class GameScene extends Scene {
  private gameState: GameState;

  private spawnManager: SpawnManager;
  private collisionManager: CollisionManager;

  private glowForeground: GlowForeground;
  private waterBackground: WaterBackground;
  private player: Yacht;

  private isGameOver = false;

  private lastGameStateUpdateTime = 0;

  private wheelIslandGameObject?: BaseSpawnedObject;

  constructor() {
    super(GAME_SCENE_NAME);

    this.gameState = new GameState();

    this.player = new Yacht(this, this.gameState);
    this.glowForeground = new GlowForeground(this);
    this.waterBackground = new WaterBackground(this, this.gameState);

    this.spawnManager = new SpawnManager(this, this.gameState);
    this.collisionManager = new CollisionManager(
      this,
      this.gameState,
      this.setWheelIslandGameObject.bind(this)
    );
  }

  init(gameSettings: GameSettings) {
    this.isGameOver = false;
    this.lastGameStateUpdateTime = 0;

    const { spawnObjectsScenario, ...level } = prepareLevel(gameSettings);

    this.spawnManager.init(spawnObjectsScenario);
    this.gameState.init(level);
  }

  create() {
    this.player.create();

    this.glowForeground.create();
    this.waterBackground.create();
    this.spawnManager.create();

    this.collisionManager.create(
      this.player,
      this.spawnManager.getSpawnGroups()
    );

    this.data.set(GAME_SCENE_OBJECT.PLAYER, this.player.arcadeColliderType);

    this.events.once(Scenes.Events.DESTROY, this.handleCleanup, this);

    this.game.events.emit(GAME_EVENT_GAME_READY);
  }

  update(time: number, delta: number) {
    // gameState должен обновляться первым, т.к. от него зависит все остальное
    this.gameState.update(time, delta);

    this.emitGameStateUpdate(time);

    this.waterBackground.update(delta);

    if (this.gameState.isGameOver) {
      void this.finishGame();

      return;
    }

    this.spawnManager.update();
    this.player.update();
  }

  async startGame() {
    this.player.disableInput();

    await this.player.playIntroAnimation();

    this.player.enableInput();
    this.gameState.play();
  }

  collectBonus(bonus: SkillWheelBonus) {
    this.gameState.collectBonus(bonus);
    this.wheelIslandGameObject?.despawn();
  }

  private setWheelIslandGameObject(wheelIslandGameObject: BaseSpawnedObject) {
    this.wheelIslandGameObject = wheelIslandGameObject;
  }

  private emitGameStateUpdate(time: number, force = false) {
    if (
      !force &&
      time - this.lastGameStateUpdateTime < GAME_STATE_UPDATE_INTERVAL_MS
    ) {
      return;
    }

    this.lastGameStateUpdateTime = time;

    this.game.events.emit(
      GAME_EVENT_GAME_STATE_UPDATE,
      prepareGameStateUpdatePayload(this.gameState)
    );
  }

  private async finishGame() {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;

    this.physics.world.pause();
    this.tweens.killAll();
    this.collisionManager.disableCollision();
    await this.player.finishGame();
    this.game.events.emit(
      GAME_EVENT_FINISH,
      prepareGameFinishPayload(this.gameState)
    );
  }

  private handleCleanup() {
    this.collisionManager.destroy();
    this.glowForeground.destroy();
    this.waterBackground.destroy();
    this.player.destroy();
  }
}
