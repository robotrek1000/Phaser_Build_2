export const TUNING = {
  SPEED_START_KMH: 60,
  FUEL_START: 0.0001,
  FUEL_DRAIN_PER_SEC: 0,
  FUEL_PICKUP_VALUE: 0.01,
  SPEED_PER_100M: 0,
  FUEL_HIT_PENALTY: 0.4,
} as const;

export const DYNAMIC_BUOY_STATES = {
  up: {
    delta: 0.1,
    durationMs: 1000,
    textureKey: "money-change-up",
    stateId: 1,
  },
  no: {
    delta: 0,
    durationMs: 0,
    textureKey: "money-change-no",
    stateId: 2,
  },
  down: {
    delta: -0.4,
    durationMs: 1000,
    textureKey: "money-change-down",
    stateId: 3,
  },
} as const;

export const DYNAMIC_BUOY_STATE_ORDER = ["up", "no", "down"] as const;

export const RUN_TIMER = {
  initialMs: 40_000,
  bonusMs: 10_000,
} as const;

export const DISTANCE_CHECKPOINTS = [400, 800, 1200] as const;

export const LANDMARK_METERS = {
  island200: 400,
  tavern400: 800,
  harbor610: 1250,
} as const;

export const COIN_PENDING_MILESTONES = [
  { meters: 425, coins: 5 },
  { meters: 825, coins: 10 },
  { meters: 1200, coins: 15 },
] as const;

export const COIN_REWARD_ANIMATION = {
  startDelayMs: 120,
  enterDurationMs: 320,
  holdMs: 360,
  exitDurationMs: 260,
  ease: "Sine.easeOut",
  anchorXRatio: 0.5,
  anchorYRatio: 0.35,
  depth: 140,
  scaleStart: 0.72,
  scalePeak: 1,
  scaleEnd: 1.08,
  alphaStart: 0,
  alphaPeak: 1,
  alphaEnd: 0,
} as const;

export const SPAWN_PAUSE_WINDOW_METERS = 20;

export const PROGRESS_BAR_KEYS = [
  "progress-bar-0",
  "progress-bar-1",
  "progress-bar-2",
  "progress-bar-3",
] as const;

export const SPAWN_MULTIPLIERS = [
  { minMeters: 0, maxMeters: 90, obstacle: 2, fuel: 0.1, dynamic: 10 },
  { minMeters: 90, maxMeters: 100, obstacle: 2, fuel: 0.1, dynamic: 10 },
  { minMeters: 100, maxMeters: 190, obstacle: 2, fuel: 0.1, dynamic: 10 },
  { minMeters: 190, maxMeters: 200, obstacle: 2, fuel: 0.1, dynamic: 10 },
  { minMeters: 200, maxMeters: 350, obstacle: 1.75, fuel: 0.1, dynamic: 10 },
  { minMeters: 350, maxMeters: 400, obstacle: 0.75, fuel: 0.1, dynamic: 10 },
  { minMeters: 400, maxMeters: 550, obstacle: 1.25, fuel: 0.1, dynamic: 10 },
  { minMeters: 550, maxMeters: 600, obstacle: 1.25, fuel: 0.1, dynamic: 10 },
  { minMeters: 600, maxMeters: 700, obstacle: 1.25, fuel: 0.1, dynamic: 10 },
  { minMeters: 700, maxMeters: 800, obstacle: 1, fuel: 0.1, dynamic: 10 },
  { minMeters: 800, maxMeters: 1000, obstacle: 0.75, fuel: 0.1, dynamic: 10 },
  { minMeters: 1000, maxMeters: 1200, obstacle: 0.5, fuel: 0.1, dynamic: 10 },
  { minMeters: 1200, maxMeters: 1250, obstacle: 10, fuel: 10, dynamic: 10 },
  { minMeters: 1250, maxMeters: Infinity, obstacle: 10, fuel: 10, dynamic: 10 },
] as const;

export const TIME_BONUS_SPAWN_MULTIPLIERS = [
  { minMeters: 0, maxMeters: 200, multiplier: 1.75 },
  { minMeters: 200, maxMeters: 400, multiplier: 1.75 },
  { minMeters: 400, maxMeters: 700, multiplier: 1.75 },
  { minMeters: 700, maxMeters: 800, multiplier: 0.5 },
  { minMeters: 800, maxMeters: 1000, multiplier: 0.25 },
  { minMeters: 1000, maxMeters: Infinity, multiplier: 1.75 },
] as const;

export const SPAWN_BASE_DELAYS = {
  obstacleMinMs: 1000,
  obstacleMaxMs: 1800,
  fuelMinMs: 2200,
  fuelMaxMs: 3800,
  dynamicMinMs: 2200,
  dynamicMaxMs: 3800,
} as const;

export const BUOY_SPAWN_LIMITS = {
  maxActiveTotal: 10,
} as const;

export const TIME_BONUS_LIMITS = {
  maxActiveTotal: 1,
} as const;

export const SPEED_VARIANCE = {
  minMultiplier: 1,
  maxMultiplier: 1.5,
} as const;

export const FALL_SPEED = {
  base: 0,
  perKmh: 10,
} as const;

export const WATER_SCROLL = {
  baseSpeed: 0,
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
  fuel: { width: 59, height: 95 },
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
  progressXRatio: 0.5,
  progressY: 12,
  progressScale: 0.5,
} as const;

export const ASSETS_BAR_UI = {
  offsetX: -82,
  offsetY: -150,
  anchorFromVisualBounds: true,
  anchorOffsetX: 12,
  anchorOffsetY: -10,
  width: 120,
  height: 26,
  outerRadius: 8,
  borderThickness: 3,
  borderTopColor: 0xffffff,
  borderBottomColor: 0x999999,
  frameFillColor: 0x070202,
  trackColor: 0x111111,
  trackPadding: 3,
  fillColorHigh: 0x3a860f,
  fillColorMid: 0xc2c203,
  fillColorLow: 0xab2a14,
  depth: 55,
} as const;

export const YACHT_VISUAL_SIZE = {
  targetHeightPx: 280,
  hitboxWidthRatioToVisual: 0.24,
  hitboxHeightRatioToVisual: 0.72,
  minHitboxWidthPx: 24,
  minHitboxHeightPx: 100,
} as const;

export const SHIP_ASSET_STAGES = [
  { maxPercent: 20, textureKey: "ship-1" },
  { maxPercent: 40, textureKey: "ship-2" },
  { maxPercent: 60, textureKey: "ship-3" },
  { maxPercent: 80, textureKey: "ship-4" },
  { maxPercent: 100, textureKey: "ship-5" },
] as const;

export const RED_HIT_INVULNERABILITY = {
  durationMs: 1_800,
  blinkAlphaMin: 0.1,
  blinkHalfCycleMs: 80,
  blinkEase: "Sine.easeInOut",
} as const;

export const RED_HIT_OVERLAY_EFFECT = {
  enabled: true,
  durationMs: 500,
  color: 0xff2d2d,
  alpha: 0.5,
  depth: 70,
} as const;

export const GREEN_HIT_FEEDBACK = {
  durationMs: 1_000,
  tintColor: 0x57ff58,
  blinkHalfCycleMs: 100,
  blinkEase: "Sine.easeInOut",
} as const;

export const TIME_HUD = {
  xRatio: 0.905,
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

export const RESULT_SCREEN_UI = {
  titleYRatio: 0.34,
  distanceYRatio: 0.45,
  coinsYRatio: 0.53,
  reasonYRatio: 0.61,
  lostCoinsYRatio: 0.67,
  buttonYRatio: 0.8,
  titleFontSizePx: 54,
  bodyFontSizePx: 44,
  smallFontSizePx: 40,
  buttonFontSizePx: 44,
  buttonPaddingX: 34,
  buttonPaddingY: 16,
  buttonLabel: "ОТЛИЧНО",
  fontFamily: "Fascinate",
  titleColor: "#e8f1f2",
  bodyColor: "#e8f1f2",
  coinsColor: "#f4d35e",
  buttonTextColor: "#102027",
  buttonBackgroundColor: "#f4d35e",
} as const;

export const INTRO_ONBOARDING_UI = {
  dimAlpha: 0.35,
  windowYRatio: 0.43,
  windowMaxWidthRatio: 0.9,
  windowMaxHeightRatio: 0.82,
  windowMinScale: 0.35,
  windowMaxScale: 2.2,
  windowDepth: 10,
  buttonWidthRatio: 0.56,
  buttonHeightPx: 122,
  buttonRadiusPx: 18,
  buttonOffsetFromWindowPx: 52,
  buttonBottomPaddingPx: 44,
  buttonFillColor: 0x1ab6ee,
  buttonHoverColor: 0x2bc8ff,
  buttonPressedColor: 0x1292bf,
  buttonStrokeColor: 0xffffff,
  buttonStrokeWidthPx: 0,
  buttonText: "ПОПЛЫЛИ",
  buttonTextFontFamily: "Fascinate",
  buttonTextFontSizePx: 72,
  buttonTextColor: "#ffffff",
  buttonTextStyle: "normal" as "normal" | "bold",
  buttonDepth: 20,
  overlayDepth: 5,
} as const;

export const YACHT_SWAY = {
  amplitudePx: 6,
  frequencyHz: 2.2,
} as const;

export const RELATIVE_TOUCH_ROUTING = {
  platformSource: "pointerType" as "manual" | "pointerType",
  manualPlatform: "desktop" as "desktop" | "mobile",
} as const;

export const RELATIVE_TOUCH_CONTROL = {
  desktop: {
    requirePointerDown: true,
    gainX: 1,
    gainY: 1,
    deadZonePx: 0,
    maxDeltaXPerEventPx: 120,
    maxDeltaYPerEventPx: 120,
    targetLerpPerSecX: 60,
    targetLerpPerSecY: 60,
    bodyLerpPerSecX: 18,
    bodyLerpPerSecY: 18,
    snapDistancePx: 0,
    minXPaddingPx: 12,
    maxXPaddingPx: 12,
    minYPaddingPx: 12,
    maxYPaddingPx: 12,
  },
  mobile: {
    requirePointerDown: true,
    gainX: 1,
    gainY: 1,
    deadZonePx: 0,
    maxDeltaXPerEventPx: 120,
    maxDeltaYPerEventPx: 120,
    targetLerpPerSecX: 60,
    targetLerpPerSecY: 60,
    bodyLerpPerSecX: 18,
    bodyLerpPerSecY: 18,
    snapDistancePx: 1,
    minXPaddingPx: 12,
    maxXPaddingPx: 12,
    minYPaddingPx: 12,
    maxYPaddingPx: 12,
  },
} as const;

export const BRAKING = {
  minDropFromStartKmh: 40,
  decelKmhPerSec: 40,
  recoverKmhPerSec: 10,
} as const;

export const RUN_START_SPEED = {
  startDropKmh: 40,
} as const;

export const YACHT_SPEED_Y_ANIM = {
  accelOffsetPx: 80,
  accelDurationMs: 360,
  accelReturnMs: 180,
  brakeOffsetPx: -80,
  brakeDurationMs: 180,
  brakeReturnMs: 360,
  ease: "Sine.easeOut",
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

export const COLLECT_ANIMATION_BUOY = {
  durationMs: 380,
  ease: "Sine.easeInOut",
  arcOffsetXMin: -60,
  arcOffsetXMax: 60,
  arcOffsetYMin: 40,
  arcOffsetYMax: 110,
  spriteScaleStart: 1,
  spriteScaleEnd: 0,
  spriteAlphaStart: 1,
  spriteAlphaEnd: 0,
  shadowScaleStart: 1,
  shadowScaleEnd: 0,
  shadowAlphaStart: 1,
  shadowAlphaEnd: 0,
} as const;

export const COLLECT_ANIMATION_TIME_BONUS = {
  durationMs: 380,
  ease: "Sine.easeInOut",
  arcOffsetXMin: -60,
  arcOffsetXMax: 60,
  arcOffsetYMin: 40,
  arcOffsetYMax: 110,
  spriteScaleStart: 1,
  spriteScaleEnd: 0,
  spriteAlphaStart: 1,
  spriteAlphaEnd: 0,
  shadowScaleStart: 1,
  shadowScaleEnd: 0,
  shadowAlphaStart: 1,
  shadowAlphaEnd: 0,
} as const;
