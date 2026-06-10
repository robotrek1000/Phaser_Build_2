export type YachtAnimationType =
  | 'energyShield'
  | 'slowSpeed'
  | 'whirlpool'
  | 'damageHit'
  | 'positiveHit';

export interface YachtBlinkAnimationConfig {
  tintColor: number;
  alphaMin: number;
  duration: number;
  tintStrength: number;
}
