import { GameObjects, Physics, Scene, type Types } from 'phaser';

import { ALL_OBJECTS, ASSETS_LOSS_HAZARDS } from './collision-manager.config';

import type { GameplayEvent, SpawnObjectType } from '@/game/game.types';

import { GAME_EVENT_GAMEPLAY_EVENT, GAME_EVENT_REACH_ISLAND } from '@/game';
import {
  BaseSpawnedObject,
  SPAWN_OBJECT_DATA,
} from '@/game/entities/base-spawned-object';
import { Yacht } from '@/game/entities/yacht';
import { GameState } from '@/game/system/game-state';
import { prepareGameStateUpdatePayload } from '@/game/utils';

export class CollisionManager {
  private scene: Scene;

  private gameState: GameState;

  private player?: Yacht;

  private spawnGroups?: ReadonlyMap<SpawnObjectType, Physics.Arcade.Group>;

  private colliders: Physics.Arcade.Collider[] = [];

  private setWheelIslandGameObject: (
    wheelIslandGameObject: BaseSpawnedObject
  ) => void;

  constructor(
    scene: Scene,
    gameState: GameState,
    setWheelIslandGameObject: (wheelIslandGameObject: BaseSpawnedObject) => void
  ) {
    this.scene = scene;
    this.gameState = gameState;
    this.setWheelIslandGameObject = setWheelIslandGameObject;
  }

  create(
    player: Yacht,
    spawnGroups: ReadonlyMap<SpawnObjectType, Physics.Arcade.Group>
  ) {
    this.player = player;
    this.spawnGroups = spawnGroups;

    this.enableCollision();
  }

  destroy() {
    this.disableCollision();
  }

  enableCollision() {
    this.addPlayerColliders();
    this.addPlayerEnergyShieldColliders();
    this.addBuoysColliders();
  }

  disableCollision() {
    this.colliders.forEach((collider) => collider.destroy());
    this.colliders = [];
  }

  private addPlayerColliders() {
    if (!this.spawnGroups) {
      return;
    }

    ALL_OBJECTS.forEach((type) => this.bindPlayerCollision(type));
  }

  private addPlayerEnergyShieldColliders() {
    if (!this.spawnGroups || !this.player?.energyShieldArcadeColliderType) {
      return;
    }

    const moneyDownGroup = this.spawnGroups.get('moneyDown');
    const moneyDownMagnetGroup = this.spawnGroups.get('moneyDownMagnet');
    const dynamicBuoyGroup = this.spawnGroups.get('dynamicBuoy');

    if (moneyDownGroup) {
      const collider = this.scene.physics.add.overlap(
        this.player.energyShieldArcadeColliderType,
        moneyDownGroup,
        this.handleEnergyShieldCollision
      );

      this.colliders.push(collider);
    }

    if (moneyDownMagnetGroup) {
      const collider = this.scene.physics.add.overlap(
        this.player.energyShieldArcadeColliderType,
        moneyDownMagnetGroup,
        this.handleEnergyShieldCollision
      );

      this.colliders.push(collider);
    }

    if (dynamicBuoyGroup) {
      const collider = this.scene.physics.add.overlap(
        this.player.energyShieldArcadeColliderType,
        dynamicBuoyGroup,
        this.handleEnergyShieldCollision,
        (_shield, object) => {
          const dynamicBuoy = object as BaseSpawnedObject;

          return dynamicBuoy.getData(SPAWN_OBJECT_DATA.SUBTYPE) !== 'up';
        }
      );

      this.colliders.push(collider);
    }
  }

  private addBuoysColliders() {
    if (!this.spawnGroups) {
      return;
    }

    const moneyUpGroup = this.spawnGroups.get('moneyUp');
    const moneyDownGroup = this.spawnGroups.get('moneyDown');
    const moneyDownMagnetGroup = this.spawnGroups.get('moneyDownMagnet');

    if (!moneyUpGroup || !moneyDownGroup || !moneyDownMagnetGroup) {
      return;
    }

    this.colliders.push(
      this.scene.physics.add.collider(moneyUpGroup, moneyUpGroup)
    );

    this.colliders.push(
      this.scene.physics.add.collider(moneyDownGroup, moneyDownGroup)
    );

    this.colliders.push(
      this.scene.physics.add.collider(moneyUpGroup, moneyDownGroup)
    );

    this.colliders.push(
      this.scene.physics.add.collider(moneyUpGroup, moneyDownMagnetGroup)
    );

    this.colliders.push(
      this.scene.physics.add.collider(moneyDownGroup, moneyDownMagnetGroup)
    );
  }

  private bindPlayerCollision(type: SpawnObjectType) {
    if (!this.spawnGroups || !this.player) {
      return;
    }

    const group = this.spawnGroups.get(type);

    if (!group || !this.player?.arcadeColliderType) {
      return;
    }

    const collider = this.scene.physics.add.overlap(
      this.player.arcadeColliderType,
      group,
      this.handlePlayerCollision
    );

    this.colliders.push(collider);
  }

  private handlePlayerCollision: Types.Physics.Arcade.ArcadePhysicsCallback = (
    _player,
    object
  ) => {
    const spawnedObject = object as BaseSpawnedObject;

    if (!spawnedObject.active || spawnedObject.isMarkedToDelete) {
      return;
    }

    const objectType: SpawnObjectType = spawnedObject.getData(
      SPAWN_OBJECT_DATA.TYPE
    );
    const objectSubtype = spawnedObject.getData(SPAWN_OBJECT_DATA.SUBTYPE);

    if (objectType === 'reef') {
      this.gameState.applySolidDamage(() => {
        this.emitGameGameplayEvent('reef');
      });
    }

    if (objectType === 'whirlpool') {
      this.gameState.applyWhirlpoolDamage(() => {
        this.emitGameGameplayEvent('whirlpool');
      });
    }

    if (objectType === 'energy') {
      this.emitGameGameplayEvent('energy');
      this.gameState.collectEnergy();
      void spawnedObject.despawn();
    }

    if (
      objectType === 'moneyUp' ||
      (objectType === 'dynamicBuoy' && objectSubtype === 'up')
    ) {
      this.emitGameGameplayEvent('moneyUp');
      this.gameState.collectAsset();
      void this.player?.playPositiveHitAnimation();
      void spawnedObject.despawn();
    }

    if (
      (!this.gameState.hasEnergyShield &&
        ASSETS_LOSS_HAZARDS.includes(objectType)) ||
      (objectType === 'dynamicBuoy' && objectSubtype === 'down')
    ) {
      this.gameState.applyLoss(() => {
        this.emitGameGameplayEvent('moneyDown');
      });
      void spawnedObject.despawn();
    }

    if (objectType === 'wheelIsland') {
      this.setWheelIslandGameObject(spawnedObject);
      this.scene.game.events.emit(
        GAME_EVENT_REACH_ISLAND,
        prepareGameStateUpdatePayload(this.gameState)
      );
    }

    if (objectType === 'timeBonus') {
      this.emitGameGameplayEvent('timeBonus');
      this.gameState.catchTimeBonus();
      void spawnedObject.despawn();
    }

    if (objectType === 'harbor') {
      this.gameState.reachGameGoal();
    }
  };

  private emitGameGameplayEvent(gameplayEvent: GameplayEvent) {
    this.scene.game.events.emit(GAME_EVENT_GAMEPLAY_EVENT, gameplayEvent);
  }

  private handleEnergyShieldCollision: Types.Physics.Arcade.ArcadePhysicsCallback =
    (energyShield, object) => {
      const spawnedObject = object as BaseSpawnedObject;

      void spawnedObject.handleEnergyShieldCollision(
        energyShield as GameObjects.Graphics
      );
    };
}
