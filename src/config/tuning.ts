export const TUNING = {
  SPEED_START_KMH: 20,
  FUEL_START: 1,
  FUEL_DRAIN_PER_SEC: 0.025,
  FUEL_PICKUP_VALUE: 0.25,
  DYNAMIC_BUOY_DELTA: 0.2,
  DYNAMIC_BUOY_STATE_MS: 3000,
  SPEED_PER_100M: 5,
  FUEL_HIT_PENALTY: 0.2,
} as const;

export const RUN_TIMER = {
  initialMs: 70_000,
  bonusMs: 10_000,
} as const;

export const DISTANCE_CHECKPOINTS = [100, 200, 300, 400, 500, 600] as const;

export const LANDMARK_METERS = {
  island200: 200,
  tavern400: 400,
  harbor610: 610,
} as const;

export const COIN_PENDING_MILESTONES = [
  { meters: 100, coins: 5 },
  { meters: 300, coins: 10 },
  { meters: 500, coins: 15 },
] as const;

export const SPAWN_PAUSE_WINDOW_METERS = 20;

export const PROGRESS_BAR_NEW_KEYS = [
  "progress-bar-new-0",
  "progress-bar-new-1",
  "progress-bar-new-2",
  "progress-bar-new-3",
  "progress-bar-new-4",
  "progress-bar-new-5",
  "progress-bar-new-6",
] as const;

export const SPAWN_MULTIPLIERS = [
  { minMeters: 0, maxMeters: 46, obstacle: 3, fuel: 1.75, dynamic: 10 },
  { minMeters: 46, maxMeters: 50, obstacle: 0.1, fuel: 1.75, dynamic: 10 },
  { minMeters: 50, maxMeters: 95, obstacle: 2, fuel: 1.75, dynamic: 10 },
  { minMeters: 95, maxMeters: 100, obstacle: 2, fuel: 1.75, dynamic: 0.05 },
  { minMeters: 100, maxMeters: 200, obstacle: 1.75, fuel: 2, dynamic: 1 },
  { minMeters: 200, maxMeters: 400, obstacle: 2, fuel: 2.25, dynamic: 1.75 },
  { minMeters: 400, maxMeters: 500, obstacle: 1.5, fuel: 2.5, dynamic: 1.5 },
  { minMeters: 500, maxMeters: Infinity, obstacle: 1.25, fuel: 2.75, dynamic: 1.25 },
] as const;

export const TIME_BONUS_SPAWN_MULTIPLIERS = [
  { minMeters: 0, maxMeters: 49, multiplier: 1.75 },
  { minMeters: 49, maxMeters: 50, multiplier: 0 },
  { minMeters: 50, maxMeters: 100, multiplier: 1.75 },
  { minMeters: 100, maxMeters: 200, multiplier: 1.75 },
  { minMeters: 200, maxMeters: 400, multiplier: 1.75 },
  { minMeters: 400, maxMeters: 500, multiplier: 1.75 },
  { minMeters: 500, maxMeters: Infinity, multiplier: 1.75 },
] as const;

export const SPEED_BONUS_SPAWN_MULTIPLIERS = [
  { minMeters: 0, maxMeters: 99, multiplier: 1.75 },
  { minMeters: 99, maxMeters: 100, multiplier: 0 },
  { minMeters: 100, maxMeters: 200, multiplier: 1.75 },
  { minMeters: 200, maxMeters: 400, multiplier: 1.75 },
  { minMeters: 400, maxMeters: 500, multiplier: 1.75 },
  { minMeters: 500, maxMeters: Infinity, multiplier: 1.75 },
] as const;

export const SPAWN_BASE_DELAYS = {
  obstacleMinMs: 1000,
  obstacleMaxMs: 1800,
  fuelMinMs: 2200,
  fuelMaxMs: 3800,
  dynamicMinMs: 2200,
  dynamicMaxMs: 3800,
} as const;

export const SPEED_VARIANCE = {
  minMultiplier: 1,
  maxMultiplier: 2,
} as const;

export const FALL_SPEED = {
  base: 10,
  perKmh: 10,
} as const;

export const SPEED_BONUS_FALL_SPEED_MULTIPLIERS = [
  { minKmh: 0, maxKmh: 30, multiplier: 1.1 },
  { minKmh: 30, maxKmh: 45, multiplier: 1.2 },
  { minKmh: 45, maxKmh: Infinity, multiplier: 1.3 },
] as const;

export const WATER_SCROLL = {
  baseSpeed: 0.1,
  perKmh: 0.01,
  extraPerKmhAfter20: 0,
} as const;

export const PLAY_AREA = {
  leftPaddingRatio: 0.06,
  rightPaddingRatio: 0.88,
} as const;

export const OBJECT_SIZES = {
  yacht: { width: 45, height: 200 },
  obstacle: { width: 84, height: 120 },
  fuel: { width: 84, height: 120 },
  dynamic: { width: 84, height: 120 },
} as const;

export const YACHT_HITBOX = {
  radiusXRatio: 2,
  radiusYRatio: 3,
  centerOffsetX: 0,
  centerOffsetY: 16,
  contactPaddingPx: 6,
  dynamicBuoyRadiusRatio: 0.5,
  minRadiusX: 10,
  minRadiusY: 18,
} as const;

export const FUEL_VISUAL_SCALE = 1;

export const HUD_LAYOUT = {
  speedX: 75,
  speedY: 18,
  distanceX: 75,
  distanceY: 60,
  iconOffsetX: 40,
  speedIconScale: 0.12,
  distanceIconScale: 0.15,
  speedIconYOffset: 10,
  distanceIconYOffset: 30,
  iconGap: 0,
  meterXOffset: 48,
  meterTopRatio: 0.25,
  meterSegments: 5,
  meterScale: 0.2,
  meterIconGap: 16,
  meterIconScale: 0.15,
  progressXRatio: 0.525,
  progressY: 20,
  progressScale: 0.275,
} as const;

export const TIME_HUD = {
  xOffset: 68,
  y: 14,
  scale: 0.4,
  valueYOffsetRatio: 0.68,
  valueFontFamily: "Fascinate",
  valueFontSize: "42px",
  valueColor: "#000000",
} as const;

export const LANDMARK_LAYOUT = {
  spawnY: -260,
  island200: {
    xRatio: 0.84,
    width: 320,
    height: 358,
    hitboxScaleX: 0.72,
    hitboxScaleY: 0.52,
  },
  tavern400: {
    xRatio: 0.2,
    width: 430,
    height: 406,
    hitboxScaleX: 0.7,
    hitboxScaleY: 0.52,
  },
  harbor610: {
    xRatio: 0.5,
    width: 760,
    height: 748,
    hitboxScaleX: 0.9,
    hitboxScaleY: 0.45,
  },
  harborGate: {
    height: 140,
    yOffset: 40,
  },
} as const;

export const UI_TEXT = {
  hudFontFamily: "Fascinate",
  hudSpeedSize: "28px",
  hudDistanceSize: "40px",
  hudSpeedWeight: "normal",
  hudSpeedStyle: "bold",
  hudDistanceWeight: "normal",
  hudDistanceStyle: "bold",
  hudColor: "#000000",
  resultTitleSize: "28px",
  resultBodySize: "22px",
  resultSmallSize: "20px",
  resultTitleColor: "#e8f1f2",
  resultBodyColor: "#e8f1f2",
  resultCoinsColor: "#f4d35e",
} as const;

export const UI_BUTTON = {
  fontFamily: "Arial",
  fontSize: "22px",
  color: "#102027",
  backgroundColor: "#f4d35e",
  paddingX: 16,
  paddingY: 8,
} as const;

export const INTRO_LAYOUT = {
  textYRatio: 0.42,
  handYRatio: 0.62,
  buttonYRatio: 0.82,
  handStartRatio: 0.1,
  handEndRatio: 0.9,
  handDurationMs: 2000,
  dimAlpha: 0.35,
  handScale: 0.5,
  buttonScale: 0.5,
  textSize: "40px",
} as const;

export const YACHT_SWAY = {
  amplitudePx: 6,
  frequencyHz: 2.2,
} as const;

export const YACHT_CONTROL = {
  controlLerpSpeed: 32,
} as const;

export const POINTER_JOYSTICK = {
  fullThrowDistancePx: 30,
  deadZonePx: 0,
  moveSpeedPxPerSec: 600,
  useDeflectionMagnitude: false,
  deflectionExponent: 1.2,
  maxNormalizedInput: 1,
} as const;

export const YACHT_VISUAL_OFFSET = {
  y: 32,
} as const;

export const OBJECT_DRIFT = {
  obstacle: {
    amplitudePx: 100,
    frequencyHz: 2,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
  },
  fuel: {
    amplitudePx: 25,
    frequencyHz: 1,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
  },
  dynamic: {
    amplitudePx: 50,
    frequencyHz: 1.5,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
  },
} as const;

export const TIME_BONUS = {
  textureKey: "time-bonus",
  shadowTextureKey: "time-bonus-shadow",
  spawnDelayMinMs: 2200,
  spawnDelayMaxMs: 3800,
  spawnDelayMultiplier: 2,
  spawnYOffset: -120,
  spawnSideOffset: 70,
  size: 80,
  shadowWidth: 100,
  shadowHeight: 32,
  shadowYOffset: 120,
  shadowAlpha: 0.35,
  speedYMultiplier: 1.35,
  zigzagHorizontalSpeed: 500,
  zigzagLeftBoundOffset: 24,
  zigzagRightBoundOffset: 24,
  depth: 20,
  shadowDepth: 8,
  yBobAmplitudePx: 100,
  yBobFrequencyHz: 5,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  shadowBobScale: {
    baseScaleX: 0.25,
    baseScaleY: 0.25,
    responseX: 0.05,
    responseY: 0.05,
    minScaleX: 0.1,
    maxScaleX: 1,
    minScaleY: 0.1,
    maxScaleY: 1,
  },
} as const;

export const SPEED_BONUS = {
  textureKey: "speed-bonus",
  shadowTextureKey: "speed-bonus-shadow",
  spawnDelayMinMs: 2200,
  spawnDelayMaxMs: 3800,
  spawnDelayMultiplier: 2,
  spawnYOffset: -120,
  spawnSideOffset: 70,
  size: 80,
  shadowWidth: 100,
  shadowHeight: 32,
  shadowYOffset: 120,
  shadowAlpha: 0.35,
  speedYMultiplier: 1.35,
  zigzagHorizontalSpeed: 500,
  zigzagLeftBoundOffset: 24,
  zigzagRightBoundOffset: 24,
  depth: 20,
  shadowDepth: 8,
  yBobAmplitudePx: 100,
  yBobFrequencyHz: 5,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  shadowBobScale: {
    baseScaleX: 0.25,
    baseScaleY: 0.25,
    responseX: 0.05,
    responseY: 0.05,
    minScaleX: 0.1,
    maxScaleX: 1,
    minScaleY: 0.1,
    maxScaleY: 1,
  },
  effectDurationMs: 5_000,
  speedMultiplier: 2,
} as const;

export const BONUS_SPAWN = {
  maxConsecutiveSameType: 1,
  initialType: "random" as "random" | "time" | "speed",
} as const;

export const BUOY_COLLISION = {
  impulsePxPerSec: 500,
  impulseRandomMin: 0.85,
  impulseRandomMax: 1.15,
  separationPx: 6,
  pushDampingPerSec: 4.5,
  maxPushOffsetPx: 220,
  verticalImpulseFactor: 0.45,
  maxVerticalPushPxPerSec: 180,
  minFallSpeedFactor: 0.6,
  pairCooldownMs: 80,
} as const;

export const BUOY_HITBOX = {
  globalScale: 10,
  obstacle: { radiusRatio: 0.5, centerXRatio: 0.5, centerYRatio: 0.63 },
  fuel: { radiusRatio: 0.5, centerXRatio: 0.5, centerYRatio: 0.63 },
  dynamic: { radiusRatio: 0.5, centerXRatio: 0.5, centerYRatio: 0.63 },
} as const;

export const FUEL_SWAY = {
  amplitudeDeg: 4,
  frequencyHz: 1.1,
  phaseMin: 0,
  phaseMax: Math.PI * 2,
} as const;

export const DYNAMIC_SWAY = {
  amplitudeDeg: 4,
  frequencyHz: 1.1,
  phaseMin: 0,
  phaseMax: Math.PI * 2,
} as const;

export const OBSTACLE_SWAY = {
  amplitudeDeg: 4,
  frequencyHz: 1.1,
  phaseMin: 0,
  phaseMax: Math.PI * 2,
} as const;

export const IMPACT_ANIMATION = {
  spinDurationMs: 600,
  scaleUp: 1.3,
  scaleUpPortion: 0.4,
  scaleDownPortion: 0.6,
  spinScaleMin: 0,
} as const;

export const HUD_FEEDBACK = {
  scaleFrom: 0,
  scaleUp: 1,
  scaleHold: 0.35,
  appearDurationMs: 200,
  upDurationMs: 500,
  holdDurationMs: 2000,
  downDurationMs: 250,
  offsetY: -50,
} as const;
