import type { GameSettings } from '@/game/level-design';
import type { SkillWheelDisplayedBonusesValues } from '@/game/system/game-state';
import type { ClientYachtType } from '@/shared/types';

export type SpawnObjectType =
  | 'moneyDown'
  | 'moneyDownMagnet'
  | 'dynamicBuoy'
  | 'whirlpool'
  | 'reef'
  | 'moneyUp'
  | 'energy'
  | 'timeBonus'
  | 'wheelIsland'
  | 'harbor';

export interface GameStateUpdatePayload {
  distance: number;
  totalDistance: number;
  assetsProgress: number;
  assetsCapacity: number;
  energy: number;
  coins: number;
  timeLeft: number;
  yachtSkin: ClientYachtType;
  bonuses: SkillWheelDisplayedBonusesValues;
}

export interface GameFinishPayload extends Omit<
  GameStateUpdatePayload,
  'energy'
> {
  isAtPort: boolean;
}

export type GameEvent =
  | 'loadProgress'
  | 'loadFinish'
  | 'gameReady'
  | 'updateSettings'
  | 'reachIsland'
  | 'gameStateUpdate'
  | 'gameplayEvent'
  | 'finish';

export type GameplayEvent =
  | 'moneyUp'
  | 'moneyDown'
  | 'energy'
  | 'timeBonus'
  | 'whirlpool'
  | 'reef'
  | 'activateEnergyShield'
  | 'deactivateEnergyShield';

export interface GameEventMap {
  loadProgress: number;
  loadFinish: undefined;
  gameReady: undefined;
  updateSettings: GameSettings;
  reachIsland: GameStateUpdatePayload;
  gameStateUpdate: GameStateUpdatePayload;
  gameplayEvent: GameplayEvent;
  finish: GameFinishPayload;
}
