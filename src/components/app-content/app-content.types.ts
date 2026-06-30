import type { GameSettings } from '@/game/level-design';

export type State = 'loading' | 'main' | 'playing' | 'bonusWheel' | 'result';

export interface AppContentProps {
  onContentReady(): void;
}

export type Boosters = Pick<
  GameSettings,
  | 'isEngineImproved'
  | 'isShieldReinforced'
  | 'isBodyReinforced'
  | 'isSteeringWheelFast'
>;

export type BoosterKey = keyof Boosters;

export type GameStartAnimationState = 'hidden' | 'playing' | 'paused';
