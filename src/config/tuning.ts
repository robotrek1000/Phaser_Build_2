// ===== 1. Общие параметры =====


// Базовые глобальные параметры


export const TUNING = {
  SPEED_START_KMH: 30,
  FUEL_START: 0,
  FUEL_DRAIN_PER_SEC: 0,
  FUEL_PICKUP_VALUE: 0.1,
  SPEED_PER_100M: 5,
} as const;

export const PLAY_AREA = {
  leftPaddingRatio: 0.06,
  rightPaddingRatio: 0.88,
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

// UI и HUD


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

export const COIN_UI_CONFIG = {
  x: 14,
  y: 12,
  width: 136,
  height: 86,
  radius: 16,
  titleHeight: 30,
  title: "МОНЕТЫ",
  titleFontFamily: "Fascinate",
  titleFontSizePx: 22,
  titleColor: "#000000",
  panelColor: 0xd9d9d9,
  titlePanelColor: 0xb7b7b7,
  iconKey: "coin",
  iconSize: 28,
  iconXOffset: 22,
  valueFontFamily: "Fascinate",
  valueFontSizePx: 52,
  valueColor: "#000000",
  valueXOffset: 56,
  depth: 52,
} as const;

export const TIME_UI_CONFIG = {
  xRatio: 0.905,
  y: 12,
  width: 136,
  height: 86,
  radius: 16,
  titleHeight: 30,
  title: "ВРЕМЯ",
  titleFontFamily: "Fascinate",
  titleFontSizePx: 22,
  titleColor: "#000000",
  panelColor: 0xd9d9d9,
  titlePanelColor: 0xb7b7b7,
  valueFontFamily: "Fascinate",
  valueFontSizePx: 52,
  valueColor: "#000000",
  depth: 52,
} as const;

export const TOP_PROGRESS_BAR_CONFIG = {
  anchorXRatio: 0.54,
  anchorY: 24,
  depth: 52,
  master: {
    scaleX: 1.1,
    scaleY: 1.1,
    offsetX: -12.5,
    offsetY: 10,
  },
  bar: {
    width: 300,
    height: 34,
    radius: 14,
    frameColor: 0x143f80,
    fillColor: 0xffd220,
    scaleX: 1,
    scaleY: 1,
    offsetX: 0,
    offsetY: 0,
    fillInsetLeftPx: 0,
    fillInsetRightPx: 0,
    fillInsetTopPx: 0,
    fillInsetBottomPx: 0,
    minVisibleFillPx: 0,
    clipPaddingPx: 0,
  },
  ship: {
    key: "ship-1",
    baseScale: 0.17,
    rotationDeg: -90,
    flipX: true,
    flipY: true,
    scaleX: 1,
    scaleY: 1,
    offsetX: 0,
    offsetY: -2,
    progressAnchorOffsetX: 0,
    progressAnchorOffsetY: 0,
    clampToBar: true,
  },
  flag: {
    key: "flag-new",
    baseScale: 0.12,
    scaleX: 1,
    scaleY: 1,
    offsetX: 5,
    offsetY: -5,
    anchorOffsetX: 0,
    anchorOffsetY: 0,
  },
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

export const PROGRESS_BAR_KEYS = [
  "progress-bar-0",
  "progress-bar-1",
  "progress-bar-2",
  "progress-bar-3",
] as const;

// Debug


export const HITBOX_DEBUG = {
  enabled: false,
  depth: 300,
  lineWidth: 3,
  alpha: 1,
  drawArcadeBodies: true,
  drawSolidEllipses: true,
  drawShieldZones: true,
  colors: {
    yachtBody: 0x00e5ff,
    yachtHazardCollider: 0xff8a00,
    hazards: 0xff00ff,
    moneyUps: 0x7cff00,
    coins: 0xffffff,
    bonuses: 0x3f48ff,
    solids: 0xffff00,
    harborGate: 0xffffff,
    solidEllipse: 0x00ffff,
    shieldAttract: 0x00ff66,
    shieldRepel: 0xff3333,
    shieldRepelBoundary: 0xffb347,
    shieldPickup: 0x5b6dff,
  },
} as const;

// ===== 2. Общая игровая логика и сегменты =====


// Тайминг и скорость ранна


export const RUN_TIMER = {
  initialMs: 60_000,
  bonusMs: 10_000,
} as const;

export const RUN_START_SPEED = {
  startDropKmh: 0,
} as const;

export const RUN_SPEED_RAMP = {
  startKmh: 30,
  everyMeters: 100,
  addKmhPerStep: 5,
  maxKmh: 80,
  maxAtMeters: 1000,
} as const;

export const BRAKING = {
  minDropFromStartKmh: 20,
  decelKmhPerSec: 40,
  recoverKmhPerSec: 24,
} as const;

export const OBSTACLE_SLOWDOWN = {
  enabled: true,
  hitDurationMs: 1_250,
  dropKmh: 22,
  decelKmhPerSec: 45,
  recoverKmhPerSec: 30,
} as const;

// Прогресс и чекпоинты


export const DISTANCE_CHECKPOINTS = [400, 800, 1200] as const;

export const LANDMARK_METERS = {
  island1: 400,
  island2: 800,
  harbor: 1250,
} as const;

export const COIN_PENDING_MILESTONES = [
  { meters: 425, coins: 5 },
  { meters: 825, coins: 10 },
  { meters: 1200, coins: 15 },
] as const;

// Общие коллизии и урон


export const HAZARD_COLLISION = {
  pairCooldownMs: 120,
  impulsePxPerSec: 500,
  impulseRandomMin: 0.85,
  impulseRandomMax: 1.15,
  separationPx: 6,
  verticalImpulseFactor: 0.45,
  maxVerticalPushPxPerSec: 180,
  pushDampingPerSec: 4.8,
  maxPushOffsetPx: 280,
  minFallSpeedFactor: 0.55,
} as const;

export const HAZARD_DAMAGE = {
  mine: 0.24,
  moneyDown: 0.4,
  dynamicDown: 0.4,
  pirate: 0.35,
  whirlpool: 0.24,
} as const;

export const BUOY_COLLISION_LAYER = {
  enabled: true,
  allowCollectingObjects: false,
  pairs: {
    hazardToHazard: true,
    hazardToMoneyUp: true,
    moneyUpToMoneyUp: true,
    hazardToSolids: true,
    moneyUpToSolids: true,
  },
  participants: {
    moneyUp: true,
    moneyDown: true,
    dynamicBuoy: true,
    mine: true,
    pirate: true,
    whirlpool: true,
  },
  allowNonBlockingHazards: {
    moneyDown: false,
    dynamicBuoy: false,
    mine: false,
    pirate: false,
    whirlpool: true,
  },
  solids: {
    rock1: true,
    rock2: true,
    rock3: true,
    island1: true,
    island2: true,
    harbor: true,
  },
} as const;

export const IMPACT_ANIMATION = {
  spinDurationMs: 600,
  scaleUp: 1.3,
  scaleUpPortion: 0.4,
  scaleDownPortion: 0.6,
  spinScaleMin: 0,
} as const;

// Сегментный спавн и правила


export const SEGMENT_SPAWN = {
  objectSpawnY: -280,
  cleanupYExtra: 140,
  scheduleLookaheadMeters: 8,
} as const;

export const SEGMENT_POOL_RULES = {
  poolSizeMeters: 100,
  poolCount: 12,
  finalStartMeters: 1200,
  finalEndMeters: 1250,
} as const;

export const SEGMENT_PATTERN_RULES = {
  poolLengthMeters: 100,
  allowedSegmentLengthsMeters: [50, 100] as const,
  fallbackTemplateId: "ordinary_filler_50",
  stages: {
    early: { poolIndexFrom: 1, poolIndexTo: 2 },
    mid: { poolIndexFrom: 3, poolIndexTo: 6 },
    late: { poolIndexFrom: 7, poolIndexTo: 9 },
    endgame: { poolIndexFrom: 10, poolIndexTo: 12 },
  },
  requiredPerPool: {
    moneyUpMinDefault: 1,
    moneyUpMinEarly: 2,
    moneyDownMinByStage: {
      early: 1,
      mid: 2,
      late: 3,
      endgame: 4,
    },
    dynamicBuoyMinFromPoolIndex: 3,
    dynamicBuoyMinDefault: 1,
    rockMin: 1,
    timeBonusMin: 1,
    speedBonusMin: 1,
  },
  guaranteedSpawnPaddingMeters: {
    min: 6,
    max: 6,
  },
} as const;

export const SEGMENT_PICKUP_RULES = {
  coin: {
    totalCount: 30,
    oneCoinPerSegment: true,
    segmentOffsetMinMeters: 8,
    segmentOffsetMaxMeters: 38,
    segmentXRatioMin: 0.22,
    segmentXRatioMax: 0.78,
    finalFillStartMeters: 1200,
    finalFillEndMeters: 1250,
    finalFillXRatioMin: 0.18,
    finalFillXRatioMax: 0.82,
  },
  speedBonus: {
    xRatioMin: 0.22,
    xRatioMax: 0.78,
  },
} as const;

export const SEGMENT_COIN_SAFETY = {
  enabled: true,
  blockingTypes: ["mine", "pirate", "whirlpool", "rock1", "rock2", "rock3"] as const,
  minDeltaMeters: 7,
  minDeltaXRatio: 0.12,
  maxResampleAttempts: 18,
  resampleMeterJitterMeters: 7,
  safeXRatioMin: 0.2,
  safeXRatioMax: 0.8,
  finalFillExtraAttemptsMultiplier: 3,
} as const;

// Анимации наград и сбора


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

// ===== 3. Параметры яхты (игрока) =====


// Управление


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
    targetLerpPerSecX: 80,
    targetLerpPerSecY: 80,
    bodyLerpPerSecX: 18,
    bodyLerpPerSecY: 18,
    snapDistancePx: 0,
    minXPaddingPx: 0,
    maxXPaddingPx: 0,
    minYPaddingPx: 0,
    maxYPaddingPx: 0,
  },
} as const;

// Визуал и движение яхты


export const YACHT_VISUAL_SIZE = {
  targetHeightPx: 280,
  hitboxWidthRatioToVisual: 0.56,
  hitboxHeightRatioToVisual: 0.88,
  minHitboxWidthPx: 84,
  minHitboxHeightPx: 184,
  hitboxOffsetX: 4,
  hitboxOffsetY: 30,
} as const;

export const YACHT_VISUAL_OFFSET = {
  y: 32,
} as const;

export const YACHT_SWAY = {
  amplitudePx: 6,
  frequencyHz: 2.2,
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

export const SHIP_ASSET_STAGES = [
  { maxPercent: 20, textureKey: "ship-1" },
  { maxPercent: 40, textureKey: "ship-2" },
  { maxPercent: 60, textureKey: "ship-3" },
  { maxPercent: 80, textureKey: "ship-4" },
  { maxPercent: 100, textureKey: "ship-5" },
] as const;

// Хитбоксы и блокеры яхты

export const YACHT_HAZARD_HITBOX = {
  widthRatioToVisual: 0.56,
  heightRatioToVisual: 0.88,
  minWidthPx: 84,
  minHeightPx: 184,
  offsetX: 4,
  offsetY: 30,
} as const;

export const YACHT_SOLID_BLOCKERS = {
  rock1: true,
  rock2: true,
  rock3: true,
  island1: false,
  island2: false,
  harbor: false,
} as const;

export const YACHT_SOLID_CONTACT_RESOLVE = {
  minSeparationPx: 1,
  axisTieEpsilonPx: 1.5,
  syncTargetsAfterResolve: true,
} as const;

// Щит и feedback-эффекты


export const ASSET_SHIELD_CONFIG = {
  enable: true,
  activation: {
    manualOnly: false,
    fuelReadyThreshold: 1,
    allowManualStop: false,
  },
  runtime: {
    durationMs: 5_000,
    timerEnabled: false,
    drainEnabled: true,
    drainPerSec: 0.1,
    minFuelWhileActive: 0,
    autoStopOnFuelEmpty: true,
    autoStopOnFuelBelowReadyThreshold: false,
  },
  refresh: {
    resetOnMoneyUp: false,
    resetOnDynamicUp: false,
    stacking: false,
  },
  invulnerability: {
    enabled: true,
    affectedHazards: ["moneyDown", "dynamicDown", "mine", "pirate", "whirlpool"] as const,
    contactPushEnabled: true,
    contactPushByType: {
      moneyDown: {
        impulsePxPerSec: 560,
        separationPx: 14,
        verticalImpulseFactor: 0.3,
        maxVerticalPushPxPerSec: 180,
        cooldownMs: 120,
      },
      dynamicDown: {
        impulsePxPerSec: 560,
        separationPx: 14,
        verticalImpulseFactor: 0.3,
        maxVerticalPushPxPerSec: 180,
        cooldownMs: 120,
      },
      mine: {
        impulsePxPerSec: 520,
        separationPx: 14,
        verticalImpulseFactor: 0.32,
        maxVerticalPushPxPerSec: 180,
        cooldownMs: 140,
      },
      pirate: {
        impulsePxPerSec: 760,
        separationPx: 18,
        verticalImpulseFactor: 0.4,
        maxVerticalPushPxPerSec: 260,
        cooldownMs: 160,
      },
      whirlpool: {
        impulsePxPerSec: 0,
        separationPx: 0,
        verticalImpulseFactor: 0,
        maxVerticalPushPxPerSec: 0,
        cooldownMs: 0,
      },
    },
  },
  magnet: {
    attract: {
      enabled: true,
      targets: {
        moneyUp: true,
        dynamicUp: true,
      },
      originOffsetX: 0,
      originOffsetY: 0,
      radiusPx: 300,
      forcePxPerSec: 6000,
      forceDistribution: "falloff" as "uniform" | "falloff",
      falloffPower: 0.5,
      minEffectiveDistancePx: 0,
      centerDirection: {
        useLastResolvedDirection: true,
        useVelocityFallback: true,
        fallbackDirX: 1,
        fallbackDirY: 0,
      },
      maxPushSpeedPxPerSec: 1000,
      axisFactorX: 1,
      axisFactorY: 1,
      updateCooldownMs: 0,
      clampToPlayAreaX: false,
      clampPaddingX: 0,
      clampToViewportY: false,
      clampPaddingY: 0,
    },
    repel: {
      enabled: true,
      targets: {
        moneyDown: true,
        dynamicDown: true,
      },
      originOffsetX: 0,
      originOffsetY: 0,
      radiusPx: 400,
      forcePxPerSec: 4200,
      forceDistribution: "uniform" as "uniform" | "falloff",
      falloffPower: 0.35,
      minEffectiveDistancePx: 0,
      centerDirection: {
        useLastResolvedDirection: true,
        useVelocityFallback: true,
        fallbackDirX: 1,
        fallbackDirY: 0,
      },
      maxPushSpeedPxPerSec: 3000,
      axisFactorX: 1,
      axisFactorY: 1,
      updateCooldownMs: 0,
      clampToPlayAreaX: false,
      clampPaddingX: 0,
      clampToViewportY: false,
      clampPaddingY: 0,
      hardBoundary: {
        enabled: true,
        radiusPx: 0,
        boundaryPaddingPx: 8,
        projectOutMode: "softPush" as "softPush" | "hardSnap",
        projectEveryFrame: true,
        outwardImpulseAfterProjectPxPerSec: 10000,
        softProjectMaxStepPxPerSec: 2600,
        softProjectMinStepPx: 2,
        penetrationGain: 0.1,
        emergencyHardSnapPenetrationPx: 0,
        releaseOutwardBoostPxPerSec: 3000,
        releaseMinOutwardSpeedPxPerSec: 3000,
        clampMaxPushSpeedAfterProject: false,
      },
    },
  },
  pickupMagnet: {
    enabled: true,
    allowWhileCollecting: false,
    anchorOffsetX: 0,
    anchorOffsetY: 0,
    updateCooldownMs: 0,
    common: {
      radiusPx: 300,
      forcePxPerSec: 1800,
      falloffPower: 0.9,
      minDistancePx: 14,
      maxPullSpeedPxPerSec: 960,
      axisFactorX: 1,
      axisFactorY: 1,
      clampToPlayAreaX: true,
      clampPaddingX: 36,
      clampToViewportY: true,
      clampPaddingY: 60,
    },
    targets: {
      coin: {
        enabled: true,
        radiusPx: 300,
        forcePxPerSec: 1900,
        falloffPower: 0.9,
        minDistancePx: 12,
        maxPullSpeedPxPerSec: 980,
        axisFactorX: 1,
        axisFactorY: 1,
      },
      timeBonus: {
        enabled: true,
        radiusPx: 320,
        forcePxPerSec: 1700,
        falloffPower: 1,
        minDistancePx: 14,
        maxPullSpeedPxPerSec: 900,
        axisFactorX: 1,
        axisFactorY: 1,
      },
      speedBonus: {
        enabled: true,
        radiusPx: 340,
        forcePxPerSec: 1600,
        falloffPower: 1.05,
        minDistancePx: 16,
        maxPullSpeedPxPerSec: 860,
        axisFactorX: 1,
        axisFactorY: 1,
      },
    },
  },
  visual: {
    radiusPx: 250,
    thicknessPx: 70,
    innerColor: 0x78e3ff,
    outerColor: 0x8b4dff,
    innerAlpha: 0.08,
    outerAlpha: 0.95,
    alpha: 0.78,
    gradientSteps: 16,
    yOffsetPx: 0,
    depth: 4,
    appear: {
      durationMs: 1_000,
      startScale: 0.72,
      endScale: 1,
    },
    disappear: {
      durationMs: 260,
      endScale: 0.9,
    },
    bezier: {
      x1: 1,
      y1: 0.01,
      x2: 1,
      y2: 1,
    },
  },
  fadeOut: {
    enabled: true,
    cutoffAlpha: 0.25,
    hardDropToZeroBelowCutoff: true,
  },
  shipBlink: {
    enabled: true,
    tintColor: 0xad6cff,
    blinkAlphaMin: 0.58,
    blinkHalfCycleMs: 90,
    blinkEase: "Sine.easeInOut",
    tintStrength: 0.72,
  },
  button: {
    hidden: true,
    radiusPx: 56,
    marginLeftPx: 22,
    marginBottomPx: 22,
    strokeWidthPx: 4,
    strokeColor: 0x111111,
    depth: 95,
    textFontFamily: "Fascinate",
    textFontSizePx: 52,
    disabled: {
      label: "Щит",
      fillColor: 0xb4b4b4,
      textColor: "#141414",
      scale: 1,
    },
    ready: {
      label: "Жми",
      fillColor: 0x19ba14,
      textColor: "#ffffff",
      scale: 1.06,
    },
    active: {
      label: "Стоп",
      fillColor: 0xe70f0f,
      textColor: "#ffffff",
      scale: 1.08,
    },
    stateTransitionDurationMs: 200,
    stateTransitionEase: "Sine.easeOut",
    tapRejectedPulseScale: 0.92,
    tapRejectedPulseDurationMs: 120,
  },
  tapGesture: {
    maxTapDurationMs: 240,
    maxTapMovePx: 18,
    tapDebounceMs: 110,
    tapCooldownMs: 90,
  },
} as const;

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

export const RED_BUOY_HIT_FEEDBACK = {
  enabled: true,
  durationMs: 1_000,
  tintColor: 0xff3a3a,
  fromColor: 0xffffff,
  blinkHalfCycleMs: 100,
  blinkEase: "Sine.easeInOut",
  yoyo: true,
  repeatMode: "fitDuration" as "fitDuration" | "fixed",
  repeatCount: 4,
  clearTintOnStart: true,
  clearTintOnComplete: true,
  suppressWhenShieldBlinkActive: true,
  interruptExistingTintTween: true,
} as const;

// ===== 4. Параметры игровых объектов =====


// Буйки


export const OBJECT_SIZES = {
  yacht: { width: 45, height: 200 },
  moneyUp: { width: 84, height: 120 },
} as const;

export const MONEY_UP_HITBOX = {
  radiusXRatio: 3,
  radiusYRatio: 4,
  centerXRatio: 5,
  centerYRatio: 6,
} as const;

export const MONEY_DOWN_CONFIG = {
  textureKey: "money-down",
  width: 84,
  height: 120,
  depth: 14,
  speedYMultiplier: 1,
  driftAmplitudePx: 100,
  driftFrequencyHz: 2,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 4,
  swayFrequencyHz: 1.1,
  hitbox: {
    radiusXRatio: 3,
    radiusYRatio: 4,
    centerXRatio: 5,
    centerYRatio: 6,
  },
  collisionCooldownMs: 220,
  applyImpactAnimation: true,
  destroyOnContact: true,
} as const;

export const DYNAMIC_BUOY_STATES = {
  up: {
    textureKey: "money-change-up",
    dwellMs: 1_000,
    fuelDelta: 0.2,
  },
  down: {
    textureKey: "money-change-down",
    dwellMs: 1_000,
    fuelPenalty: 0.4,
  },
  no: {
    textureKey: "money-change-no",
  },
} as const;

export const DYNAMIC_BUOY_CONFIG = {
  width: 84,
  height: 120,
  depth: 14,
  speedYMultiplier: 0.7,
  driftAmplitudePx: 50,
  driftFrequencyHz: 1.5,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 4,
  swayFrequencyHz: 1.1,
  hitbox: {
    radiusXRatio: 3,
    radiusYRatio: 4,
    centerXRatio: 5,
    centerYRatio: 6,
  },
  collisionCooldownMs: 220,
  applyImpactAnimation: true,
  destroyOnContact: true,
} as const;

export const DYNAMIC_BUOY_BLINK = {
  flashCountDefault: 3,
  totalDurationMs: 580,
  preHoldMs: 40,
  postHoldMs: 40,
  flashOnMs: 60,
  flashOffMs: 60,
  scaleToTotalDuration: true,
  easing: "Sine.easeInOut",
  lockCollisionToSourceState: true,
  stateTextureAlignment: {
    up: {
      displayWidth: 84,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
    no: {
      displayWidth: 84,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
    down: {
      displayWidth: 84,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
  },
} as const;

// Препятствия


export const MINE_CONFIG = {
  textureKey: "obstacle-mine",
  width: 112,
  height: 104,
  depth: 14,
  speedYMultiplier: 1.04,
  driftAmplitudePx: 24,
  driftFrequencyHz: 1.25,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 7,
  swayFrequencyHz: 1.15,
  hitbox: {
    radiusXRatio: 1,
    radiusYRatio: 1,
    centerXRatio: 1.2,
    centerYRatio: 1.25,
  },
  collisionCooldownMs: 220,
  applyImpactAnimation: true,
  magnet: {
    enabled: true,
    attractEnabled: true,
    attractRadiusPx: 600,
    attractForcePxPerSec: 1_000,
    attractFalloffPower: 0.05,
    maxPushSpeedPxPerSec: 5_000,
    minDistancePx: 12,
    centerOffsetX: 0,
    centerOffsetY: 0,
    axisFactorX: 1,
    axisFactorY: 1,
    updateCooldownMs: 0,
    impulseScaleWhenShieldActive: 1,
    allowWhileCollecting: false,
  },
} as const;

export const PIRATE_CONFIG = {
  textureKey: "obstacle-pirate",
  width: 112,
  height: 246,
  depth: 15,
  speedYMultiplier: 1.2,
  driftAmplitudePx: 74,
  driftFrequencyHz: 0.9,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 4,
  swayFrequencyHz: 0.8,
  turnNoseToVelocity: true,
  noseRotationOffsetDeg: 90,
  flipY: true,
  hitbox: {
    radiusXRatio: 0.75,
    radiusYRatio: 1,
    centerXRatio: 1,
    centerYRatio: 1,
  },
  collisionCooldownMs: 260,
  applyImpactAnimation: false,
  yachtPush: {
    impulsePxPerSec: 760,
    impulseRandomMin: 0.95,
    impulseRandomMax: 1.3,
    verticalImpulseFactor: 0.42,
    maxVerticalPushPxPerSec: 260,
    separationPx: 18,
  },
} as const;

export const TORNADO_CONFIG = {
  textureKey: "obstacle-tornado",
  width: 116,
  height: 128,
  depth: 16,
  speedYMultiplier: 1.15,
  wander: {
    targetVxAbsMin: 120,
    targetVxAbsMax: 260,
    targetVyMin: -140,
    targetVyMax: 210,
    turnIntervalMinMs: 320,
    turnIntervalMaxMs: 760,
    turnLerpPerSec: 2.6,
  },
  pulse: {
    scaleAmplitude: 0.1,
    frequencyHz: 2.2,
  },
  hitbox: {
    radiusXRatio: 0.25,
    radiusYRatio: 0.34,
    centerXRatio: 0.5,
    centerYRatio: 0.66,
  },
  collisionCooldownMs: 240,
  applyImpactAnimation: true,
  cleanupXPaddingPx: 240,
} as const;

export const WHIRLPOOL_CONFIG = {
  textureKey: "obstacle-whirlpool",
  width: 150,
  height: 114,
  depth: 12,
  speedYMultiplier: 1,
  driftAmplitudePx: 0,
  driftFrequencyHz: 1.2,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 0,
  swayFrequencyHz: 0,
  hitbox: {
    radiusXRatio: 1.5,
    radiusYRatio: 1.25,
    centerXRatio: 2.25,
    centerYRatio: 2.2,
  },
  collisionCooldownMs: 260,
  applyImpactAnimation: false,
  destroyOnContact: false,
  blocking: false,
  pulse: {
    baseScale: 1,
    amplitude: 0.5,
    frequencyHz: 1.8,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
    minScale: 0.5,
    maxScale: 2,
  },
} as const;

export const ROCK_CONFIG = {
  common: {
    depth: 15,
    speedYMultiplier: 1,
    collisionCooldownMs: 220,
    allowPartialSpawn: true,
    partialSpawnMaxOffsetPx: 120,
    applyImpactAnimation: false,
  },
  rock1: {
    textureKey: "obstacle-rock-1",
    width: 290,
    height: 356,
    ellipse: {
      radiusXRatio: 1.1,
      radiusYRatio: 0.5,
      centerXRatio: 1,
      centerYRatio: 1.75,
    },
  },
  rock2: {
    textureKey: "obstacle-rock-2",
    width: 324,
    height: 270,
    ellipse: {
      radiusXRatio: 0.75,
      radiusYRatio: 0.5,
      centerXRatio: 1,
      centerYRatio: 1.35,
    },
  },
  rock3: {
    textureKey: "obstacle-rock-3",
    width: 280,
    height: 226,
    ellipse: {
      radiusXRatio: 1,
      radiusYRatio: 0.5,
      centerXRatio: 1,
      centerYRatio: 1.6,
    },
  },
} as const;

// Пикапы


export const TIME_BONUS = {
  textureKey: "time-bonus",
  shadowTextureKey: "time-bonus-shadow",
  spawnYOffset: -120,
  width: 80,
  height: 80,
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
  yBobAmplitudePx: 34,
  yBobFrequencyHz: 0.65,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  hitbox: {
    widthRatio: 2,
    heightRatio: 2,
    offsetX: 100,
    offsetY: 100,
  },
  shadowBobScale: {
    baseScaleX: 0.25,
    baseScaleY: 0.25,
    responseX: 0.08,
    responseY: 0.08,
    minScaleX: 0.1,
    maxScaleX: 1,
    minScaleY: 0.1,
    maxScaleY: 1,
  },
} as const;

export const SPEED_BONUS_CONFIG = {
  textureKey: "speed-bonus",
  shadowTextureKey: "speed-bonus-shadow",
  spawnYOffset: -120,
  width: 80,
  height: 80,
  shadowWidth: 100,
  shadowHeight: 32,
  shadowYOffset: 116,
  shadowAlpha: 0.35,
  depth: 20,
  shadowDepth: 8,
  speedYMultiplier: 1.35,
  zigzagHorizontalSpeed: 500,
  zigzagLeftBoundOffset: 24,
  zigzagRightBoundOffset: 24,
  yBobAmplitudePx: 34,
  yBobFrequencyHz: 0.65,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  hitbox: {
    widthRatio: 2,
    heightRatio: 2,
    offsetX: 100,
    offsetY: 100,
  },
  effectDurationMs: 5_000,
  speedMultiplier: 1.5,
  transition: {
    rampUpKmhPerSec: 34,
    rampDownKmhPerSec: 18,
  },
  shadowBobScale: {
    baseScaleX: 0.25,
    baseScaleY: 0.25,
    responseX: 0.08,
    responseY: 0.08,
    minScaleX: 0.1,
    maxScaleX: 1,
    minScaleY: 0.1,
    maxScaleY: 1,
  },
} as const;

export const COIN_CONFIG = {
  textureKey: "coin",
  shadowTextureKey: "coin-shadow",
  width: 54,
  height: 54,
  shadowWidth: 52,
  shadowHeight: 16,
  shadowYOffset: 82,
  shadowAlpha: 0.45,
  depth: 20,
  shadowDepth: 8,
  speedYMultiplier: 1,
  yBobAmplitudePx: 24,
  yBobFrequencyHz: 0.70,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  hitbox: {
    widthRatio: 3,
    heightRatio: 3,
    offsetX: 100,
    offsetY: 90,
  },
  shadowBobScale: {
    baseScaleX: 0.16,
    baseScaleY: 0.07,
    responseX: 0.01,
    responseY: 0.008,
    minScaleX: 0.14,
    maxScaleX: 0.18,
    minScaleY: 0.06,
    maxScaleY: 0.08,
  },
  collectFlyToUi: true,
  collectDurationMs: 320,
} as const;

// Лендмарки


export const LANDMARK_CONFIG = {
  island1: {
    textureKey: "earth-1",
    width: 320,
    height: 358,
    depth: 15,
    ellipse: {
      radiusXRatio: 0.36,
      radiusYRatio: 0.12,
      centerXRatio: 0.52,
      centerYRatio: 0.88,
    },
  },
  island2: {
    textureKey: "earth-2",
    width: 430,
    height: 406,
    depth: 15,
    ellipse: {
      radiusXRatio: 0.35,
      radiusYRatio: 0.12,
      centerXRatio: 0.49,
      centerYRatio: 0.87,
    },
  },
  harbor: {
    textureKey: "earth-3",
    width: 760,
    height: 748,
    depth: 15,
    ellipse: {
      radiusXRatio: 0.44,
      radiusYRatio: 0.14,
      centerXRatio: 0.5,
      centerYRatio: 0.86,
    },
  },
  gate: {
    anchorCenterYRatio: 0.26,
    height: 140,
    widthPaddingPx: 0,
    depth: 14,
  },
} as const;
