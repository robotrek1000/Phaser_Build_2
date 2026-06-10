export type YachtSkin = 'normal' | 'gold';

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
  yachtSkin: YachtSkin;
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
  | 'reachIsland'
  | 'gameStateUpdate'
  | 'finish';

export interface GameEventMap {
  loadProgress: number;
  loadFinish: undefined;
  gameReady: undefined;
  reachIsland: undefined;
  gameStateUpdate: GameStateUpdatePayload;
  finish: GameFinishPayload;
}
