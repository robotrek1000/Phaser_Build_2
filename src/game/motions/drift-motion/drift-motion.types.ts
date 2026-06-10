export type Direction = 1 | -1;

export interface DriftMotionConfig {
  amplitude: number;
  minVelocityX: number;
  maxVelocityX: number;
}
