import {
  ASSETS_CONFIG,
  ENERGY_CONFIG,
  INVULNERABILITY_TIMER_MILLISECONDS,
  SOLID_COLLISION_CONFIG,
  TIMER_CONFIG,
  WHIRLPOOL_COLLISION_CONFIG,
} from './game-state.config';

import type { GameStateTypes, SkillWheelBonus } from './game-state.types';
import type { GameSettings, Level } from '@/game/level-design';

import { DEFAULT_GAME_SETTINGS } from '@/game';
import { moveTowardValue, scaled } from '@/game/utils';

export class GameState {
  private state: GameStateTypes = 'intro';

  private gameSettings: GameSettings = DEFAULT_GAME_SETTINGS;

  private totalDistanceMeters = 0;

  private distanceMeters = 0;

  private assets = 0;

  private totalAssets = 1;

  private assetsMultiplier = 1;

  private energy = 0;

  private energyMultiplier = 1;

  private isAccumulationEnergy = true;

  private remainingTimeSeconds = 0;

  private bonusCoins = 0;

  private timeBonusMultiplier = 1;

  private isGoalAchieved = false;

  private invulnerabilityTimer = 0;

  private speed = 0;

  private speedSlowdownTimer = 0;

  private whirlpoolDebuffTimer = 0;

  get gameState() {
    return this.state;
  }

  get level() {
    return this.gameSettings.level;
  }

  get yachtSkin() {
    return this.gameSettings.yachtSkin;
  }

  get speedKmh() {
    return scaled(this.speed);
  }

  get fallSpeedPxPerKmh() {
    return scaled(this.gameSettings.fallSpeedPxPerKmh);
  }

  get totalDistance() {
    return this.totalDistanceMeters;
  }

  get distanceProgress() {
    return this.isAtPort ? this.totalDistanceMeters : this.distanceMeters;
  }

  get assetsProgress() {
    return this.assets;
  }

  get energyProgress() {
    return this.energy;
  }

  get coinsProgress() {
    return this.bonusCoins;
  }

  get timer() {
    return this.remainingTimeSeconds;
  }

  get hasEnergyShield() {
    return !this.isAccumulationEnergy;
  }

  get isGameOver() {
    return this.state === 'finished';
  }

  get isAtPort() {
    return this.isGoalAchieved;
  }

  get assetsCapacity() {
    return this.totalAssets;
  }

  get isInvulnerable() {
    return Boolean(this.invulnerabilityTimer);
  }

  get hasSpeedDebuff() {
    return Boolean(this.speedSlowdownTimer);
  }

  get hasWhirlpoolDebuff() {
    return Boolean(this.whirlpoolDebuffTimer);
  }

  get skillWheelBonuses() {
    const all: Record<Exclude<SkillWheelBonus, 'coins'>, number> = {
      assets: this.assetsMultiplier - 1,
      time: this.timeBonusMultiplier - 1,
      energy: this.energyMultiplier - 1,
    };

    return Object.entries(all).reduce<
      { type: SkillWheelBonus; amount: number }[]
    >(
      (acc, [type, amount]) =>
        amount ? [...acc, { type: type as SkillWheelBonus, amount }] : acc,
      []
    );
  }

  get hasFastSteeringWheel() {
    return this.gameSettings.isSteeringWheelFast;
  }

  init({ gameSettings, timer, distance }: Omit<Level, 'spawnObjectsScenario'>) {
    this.state = 'intro';
    this.totalDistanceMeters = distance;
    this.totalAssets = gameSettings.isBodyReinforced ? 1.5 : 1;
    this.assets = this.totalAssets / 2;
    this.remainingTimeSeconds = timer;

    this.distanceMeters = 0;
    this.energy = 0;
    this.assetsMultiplier = 1;
    this.energyMultiplier = 1;
    this.timeBonusMultiplier = 1;

    this.bonusCoins = 0;

    this.isGoalAchieved = false;
    this.isAccumulationEnergy = true;
    this.invulnerabilityTimer = 0;
    this.speedSlowdownTimer = 0;
    this.whirlpoolDebuffTimer = 0;
  }

  update(time: number, delta: number) {
    switch (this.state) {
      case 'playing':
        this.updatePlayingState(time, delta);
        break;
    }
  }

  play() {
    this.state = 'playing';
  }

  collectBonus(bonus: SkillWheelBonus) {
    this.applySkillWheelBonus(bonus);
  }

  collectEnergy() {
    this.energy = Math.min(
      ENERGY_CONFIG.max,
      this.energy + ENERGY_CONFIG.upValuePerStep * this.energyMultiplier
    );

    if (this.energy === ENERGY_CONFIG.max) {
      this.isAccumulationEnergy = false;
    }
  }

  collectAsset() {
    const capacity = this.assetsCapacity;

    this.assets = Math.min(
      capacity,
      this.assets + ASSETS_CONFIG.profitPerAsset * this.assetsMultiplier
    );
  }

  catchTimeBonus() {
    this.remainingTimeSeconds +=
      TIMER_CONFIG.bonusSeconds * this.timeBonusMultiplier;
  }

  reachGameGoal() {
    this.isGoalAchieved = true;
    this.finishGame();
  }

  applyLoss() {
    if (this.hasEnergyShield || this.isInvulnerable) {
      return;
    }

    this.invulnerabilityTimer = INVULNERABILITY_TIMER_MILLISECONDS;

    this.decreaseAssets();
  }

  applySolidDamage() {
    if (
      this.gameSettings.isEngineImproved ||
      this.hasEnergyShield ||
      this.isInvulnerable
    ) {
      return;
    }

    this.speedSlowdownTimer = SOLID_COLLISION_CONFIG.durationMilliseconds;
  }

  applyWhirlpoolDamage() {
    if (
      this.gameSettings.isEngineImproved ||
      this.hasEnergyShield ||
      this.isInvulnerable
    ) {
      return;
    }

    this.whirlpoolDebuffTimer = WHIRLPOOL_COLLISION_CONFIG.durationMilliseconds;
  }

  private decreaseEnergy(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;

    const downValuePerSec =
      ENERGY_CONFIG[
        this.gameSettings.isShieldReinforced
          ? 'downValuePerSecForReinforceShield'
          : 'downValuePerSec'
      ];

    this.energy = Math.max(
      ENERGY_CONFIG.min,
      this.energy - downValuePerSec * deltaSeconds
    );

    if (this.energy === ENERGY_CONFIG.min) {
      this.isAccumulationEnergy = true;
    }
  }

  private updatePlayingState(_time: number, deltaMs: number) {
    this.updateDistance(deltaMs);
    this.updateSpeed(deltaMs);
    this.updateRemainingTimeSeconds(deltaMs);
    this.updateInvulnerabilityTimer(deltaMs);
    this.updateSpeedSlowdownTimer(deltaMs);
    this.updateWhirlpoolDebuffTimer(deltaMs);

    if (!this.remainingTimeSeconds) {
      this.finishGame();

      return;
    }

    if (!this.isAccumulationEnergy) {
      this.decreaseEnergy(deltaMs);
    }
  }

  private decreaseAssets() {
    this.assets = Math.max(0, this.assets - ASSETS_CONFIG.lossPerAsset);

    if (!this.assets) {
      this.finishGame();
    }
  }

  private finishGame() {
    this.state = 'finished';
  }

  private applySkillWheelBonus(bonus: SkillWheelBonus) {
    switch (bonus) {
      case 'coins':
        this.bonusCoins += 10;
        break;
      case 'assets':
        this.assetsMultiplier += 1;
        break;
      case 'time':
        this.timeBonusMultiplier += 1;
        break;
      case 'energy':
        this.energyMultiplier += 1;
        break;
    }
  }

  private updateSpeed(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;
    const baseSpeedKmh = this.gameSettings.speedKmh;

    let speedTargetKmh = baseSpeedKmh;
    let speedStepKmh = SOLID_COLLISION_CONFIG.recoverKmhPerSec * deltaSeconds;

    if (this.speedSlowdownTimer) {
      speedTargetKmh = Math.max(
        0,
        baseSpeedKmh - SOLID_COLLISION_CONFIG.dropKmh
      );
      speedStepKmh = SOLID_COLLISION_CONFIG.decelKmhPerSec * deltaSeconds;
    }

    this.speed = moveTowardValue(this.speed, speedTargetKmh, speedStepKmh);
  }

  private updateDistance(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;
    const speedMetersPerSecond = (this.speedKmh * 1000) / 3600;

    this.distanceMeters += speedMetersPerSecond * deltaSeconds;
  }

  private updateRemainingTimeSeconds(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;

    this.remainingTimeSeconds = Math.max(
      0,
      this.remainingTimeSeconds - deltaSeconds
    );
  }

  private updateInvulnerabilityTimer(deltaMs: number) {
    this.invulnerabilityTimer = Math.max(
      0,
      this.invulnerabilityTimer - deltaMs
    );
  }

  private updateSpeedSlowdownTimer(deltaMs: number) {
    this.speedSlowdownTimer = Math.max(0, this.speedSlowdownTimer - deltaMs);
  }

  private updateWhirlpoolDebuffTimer(deltaMs: number) {
    this.whirlpoolDebuffTimer = Math.max(
      0,
      this.whirlpoolDebuffTimer - deltaMs
    );
  }
}
