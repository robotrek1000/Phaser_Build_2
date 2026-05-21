// ===== 1. Общие параметры =====


// Базовые глобальные параметры


export const TUNING = {
  FUEL_START: 0,
  FUEL_DRAIN_PER_SEC: 0,
  FUEL_PICKUP_VALUE: 0.05,
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

export const SEA_BACKGROUND_CONFIG = {
  enabled: true,
  transitionsEnabled: true,
  transitionMode: "alphaCrossfade" as "alphaCrossfade" | "textureTransition" | "none",
  stages: [
    { id: "sea1", baseKey: "sea-bg-2", fromMeters: 0, toMeters: 400 },
    { id: "sea2", baseKey: "sea-bg-3", fromMeters: 400, toMeters: 800 },
    { id: "sea3", baseKey: "sea-bg-4", fromMeters: 800, toMeters: 1200 },
  ] as const,
  transitions: [
    { id: "t1", triggerMeters: 400, key: "sea-bg-2-to-3", fromStage: "sea1", toStage: "sea2" },
    { id: "t2", triggerMeters: 800, key: "sea-bg-3-to-4", fromStage: "sea2", toStage: "sea3" },
  ] as const,
  alphaCrossfade: {
    enabled: true,
    durationMeters: 95,
    ease: "Sine.easeInOut",
    startAlpha: 0,
    endAlpha: 1,
    syncTilePositionBetweenLayers: true,
    keepPreviousLayerUntilComplete: true,
    destroyOverlayOnComplete: false,
    clampProgress: true,
    minDurationMeters: 40,
    maxDurationMeters: 260,
    pauseDarkeningInterpolation: false,
    useProgressForDarkeningBlend: true,
  },
  textureTransition: {
    enabled: false,
    lengthMode: "textureHeightPx" as "textureHeightPx" | "fixedPx",
    lengthTextureMultiplier: 0.16,
    fallbackLengthPx: 256,
    resetTilePositionOnSwitch: false,
  },
} as const;

export const WORLD_OBJECT_DARKENING_CONFIG = {
  enabled: false,
  darkenColor: 0x000000,
  intensityByStage: {
    sea1: 0,
    sea2: 0.05,
    sea3: 0.1,
  } as const,
  transitionBlendEase: "Sine.easeInOut",
  updateDeltaThreshold: 0.001,
  preserveGameplayFeedbackTints: true,
  reapplyAfterFeedbackStops: true,
  defaultTarget: {
    enabled: true,
    intensityMultiplier: 1,
  },
  targetsByRuntimeKind: {
    yachtVisual: true,
    hazards: true,
    moneyUps: true,
    coins: true,
    timeBonuses: true,
    solids: true,
    harborGate: true,
    shieldVisual: false,
    shadows: true,
  },
  targetsByTextureKey: {
    "ship-1": { enabled: true, intensityMultiplier: 1 },
    "ship-2": { enabled: true, intensityMultiplier: 1 },
    "ship-3": { enabled: true, intensityMultiplier: 1 },
    "ship-4": { enabled: true, intensityMultiplier: 1 },
    "ship-5": { enabled: true, intensityMultiplier: 1 },
    "money-up": { enabled: true, intensityMultiplier: 1 },
    "money-down": { enabled: true, intensityMultiplier: 1 },
    "money-change-up": { enabled: true, intensityMultiplier: 1 },
    "money-change-no": { enabled: true, intensityMultiplier: 1 },
    "money-change-down": { enabled: true, intensityMultiplier: 1 },
    "obstacle-whirlpool": { enabled: true, intensityMultiplier: 1 },
    "obstacle-rock-1": { enabled: true, intensityMultiplier: 1 },
    "obstacle-rock-2": { enabled: true, intensityMultiplier: 1 },
    "obstacle-rock-3": { enabled: true, intensityMultiplier: 1 },
    "obstacle-reef-1": { enabled: true, intensityMultiplier: 1 },
    "earth-3": { enabled: true, intensityMultiplier: 1 },
    "earth-1": { enabled: true, intensityMultiplier: 1 },
    "earth-2": { enabled: true, intensityMultiplier: 1 },
    coin: { enabled: true, intensityMultiplier: 1 },
    "time-bonus": { enabled: true, intensityMultiplier: 1 },
    "speed-bonus": { enabled: true, intensityMultiplier: 1 },
    "wind-speed-bonus": { enabled: true, intensityMultiplier: 1 },
    "coin-shadow": { enabled: true, intensityMultiplier: 1 },
    "time-bonus-shadow": { enabled: true, intensityMultiplier: 1 },
    "speed-bonus-shadow": { enabled: true, intensityMultiplier: 1 },
    "wind-speed-bonus-shadow": { enabled: true, intensityMultiplier: 1 },
    "sea-bg": { enabled: false, intensityMultiplier: 1 },
    "sea-bg-2": { enabled: false, intensityMultiplier: 1 },
    "sea-bg-3": { enabled: false, intensityMultiplier: 1 },
    "sea-bg-4": { enabled: false, intensityMultiplier: 1 },
    "sea-bg-2-to-3": { enabled: false, intensityMultiplier: 1 },
    "sea-bg-3-to-4": { enabled: false, intensityMultiplier: 1 },
    "start-bg": { enabled: false, intensityMultiplier: 1 },
    "flag-new": { enabled: false, intensityMultiplier: 1 },
    "skill-wheel-sector-1": { enabled: false, intensityMultiplier: 1 },
    "skill-wheel-bar-body": { enabled: false, intensityMultiplier: 1 },
    "skill-wheel-arrow": { enabled: false, intensityMultiplier: 1 },
    "skill-wheel-bonus-1": { enabled: false, intensityMultiplier: 1 },
    "skill-wheel-bonus-3": { enabled: false, intensityMultiplier: 1 },
  } as const,
} as const;

// UI и HUD

export const ASSETS_BAR_UI = {
  anchorMode: "screen" as "screen" | "yacht",
  x: 24,
  y: 20,
  width: 140,
  widthByTierMultiplier: [1, 1.5, 2] as const,
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
  icon: {
    key: "icon-briefcase",
    sizePx: 45,
    xOffset: 6,
    yOffset: 6,
    depth: 57,
  },
  resizeTween: {
    durationMs: 320,
    ease: "Sine.easeInOut",
  },
} as const;

export const SHIELD_ENERGY_BAR_UI = {
  x: 24,
  y: 60,
  width: 140,
  height: 26,
  outerRadius: 8,
  borderThickness: 3,
  borderTopColor: 0xffffff,
  borderBottomColor: 0x999999,
  frameFillColor: 0x070202,
  trackColor: 0x111111,
  trackPadding: 3,
  fillColor: 0x7a3cff,
  depth: 55,
  icon: {
    key: "icon-shield",
    sizePx: 45,
    xOffset: 4,
    yOffset: 13,
    depth: 57,
  },
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
  anchorXRatio: 0.58,
  anchorY: 24,
  depth: 52,
  master: {
    scaleX: 1.1,
    scaleY: 1.1,
    offsetX: -30,
    offsetY: 28,
  },
  bar: {
    width: 272,
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
    baseScale: 0.42,
    rotationDeg: -90,
    flipX: true,
    flipY: true,
    scaleX: 1.47,
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

export const SKILL_WHEEL_BONUS_HUD_CONFIG = {
  enabled: true,
  depth: 58,
  rowAnchorMode: "progressBar" as "progressBar" | "screen",
  rowXRatio: 0.5,
  rowY: 112,
  rowOffsetX: 0,
  rowOffsetY: 42,
  iconSizePx: 66,
  iconScale: 1,
  iconGapPx: 10,
  layoutsByCount: {
    1: [0],
    2: [-38, 38],
    3: [-76, 0, 76],
    4: [-114, -38, 38, 114],
  } as const,
  slotFrame: {
    enabled: true,
    strokeColor: 0x000000,
    strokeWidthPx: 4,
    fillColor: 0x111111,
    fillAlpha: 0.28,
  },
  radial: {
    enabled: false,
    radiusPaddingPx: 4,
    startAngleDeg: -90,
    clockwise: true,
    trackColor: 0x0b0b0b,
    trackAlpha: 0.35,
    fillColor: 0xffffff,
    fillAlpha: 0.3,
  },
  pulseOnRefresh: {
    enabled: true,
    durationMs: 180,
    scaleUp: 1.12,
    ease: "Sine.easeOut",
  },
  multiplierText: {
    enabled: true,
    fontFamily: "Fascinate",
    fontSizePx: 48,
    color: "#ffffff",
    strokeColor: "#000000",
    strokeThickness: 6,
    offsetY: 19,
  },
} as const;

export const SKILL_WHEEL_UI_CONFIG = {
  enabled: true,
  depth: 180,
  overlay: {
    enabled: true,
    color: 0x000000,
    alpha: 0.52,
    glowColor: 0x65d8ff,
    glowAlpha: 0.00,
  },
  intro: {
    titleText: "ВЫБЕРИТЕ БОНУС",
    titleFontFamily: "Fascinate",
    titleFontSizePx: 56,
    titleColor: "#ffffff",
    titleOffsetY: 252,
  },
  result: {
    continueText: "НАЖМИТЕ ДЛЯ ПРОДОЛЖЕНИЯ",
    continueFontFamily: "Fascinate",
    continueFontSizePx: 36,
    continueColor: "#ffffff",
    continueAlpha: 0.68,
    continueOffsetY: 400,
    titleFontFamily: "Fascinate",
    titleFontSizePx: 52,
    titleColor: "#ffffff",
    bodyFontFamily: "Fascinate",
    bodyFontSizePx: 44,
    bodyColor: "#ffffff",
    titleOffsetX: 136,
    titleOffsetY: -72,
    bodyOffsetY: 170,
    iconOffsetX: -38,
    iconOffsetY: -88,
    iconMaxWidthPx: 336,
    iconMaxHeightPx: 248,
  },
  wheel: {
    centerXRatio: 0.5,
    centerYRatio: 0.43,
    barKey: "skill-wheel-bar-body",
    barScale: 0.5,
    barOffsetX: 0,
    barOffsetY: -110,
    sectorRangesDeg: [
      { minDeg: -85, maxDeg: -54 },
      { minDeg: -54, maxDeg: -4 },
      { minDeg: -4, maxDeg: 49 },
      { minDeg: 49, maxDeg: 85 },
    ] as const,
    rewardBySectorIndex: [
      "coin_plus_10",
      "assets_mult",
      "time_mult",
      "energy_mult",
    ] as const,
    spinInputEnabledAtMs: 150,
    landingLockDelayMs: 120,
    pointer: {
      key: "skill-wheel-arrow",
      scale: 0.74,
      offsetX: 12,
      offsetY: 38,
      originX: 0.5,
      originY: 0.84,
      restAngleDeg: -90,
      oscillationMinDeg: -85,
      oscillationMaxDeg: 85,
      oscillationFrequencyHz: 0.85,
      stopDurationMs: 260,
      stopEase: "Sine.easeOut",
    },
  },
} as const;

export const RESULT_SCREEN_UI = {
  panelColor: 0x1a2034,
  gridStrokeColor: 0x6a7385,
  gridStrokeWidthPx: 6,
  titleYRatio: 0.14,
  subtitleYRatio: 0.24,
  distanceYRatio: 0.32,
  tableTopYRatio: 0.38,
  tableWidthRatio: 1,
  tableHeightPx: 450,
  tableRowHeightPx: 150,
  totalYRatio: 0.76,
  noteYRatio: 0.83,
  buttonYRatio: 0.92,
  titleFontSizePx: 64,
  subtitleFontSizePx: 52,
  bodyFontSizePx: 62,
  cellHeaderFontSizePx: 48,
  cellValueFontSizePx: 48,
  smallFontSizePx: 38,
  buttonFontSizePx: 68,
  buttonPaddingX: 120,
  buttonPaddingY: 22,
  buttonLabel: "ОТЛИЧНО",
  fontFamily: "Fascinate, Arial, sans-serif",
  titleColor: "#e8f1f2",
  bodyColor: "#e8f1f2",
  successColor: "#33ff42",
  failColor: "#ff2e2e",
  coinsColor: "#f4d35e",
  noteFailColor: "#ff4d00",
  buttonTextColor: "#102027",
  buttonBackgroundColor: "#f4d35e",
} as const;

export const INTRO_ONBOARDING_UI = {
  dimAlpha: 0.35,
  windowYRatio: 0.46,
  windowMaxWidthRatio: 0.94,
  windowMaxHeightRatio: 0.92,
  windowMinScale: 0.35,
  windowMaxScale: 2.2,
  windowDepth: 10,
  continueText: "НАЖМИТЕ ДЛЯ ПРОДОЛЖЕНИЯ",
  continueFontFamily: "Fascinate",
  continueFontSizePx: 48,
  continueColor: "#ffffff",
  continueAlpha: 0.68,
  continueBottomInsetPx: 62,
  continueDepth: 20,
  continuePulseHz: 1.2,
  continuePulseMinAlpha: 0.45,
  overlayDepth: 5,
} as const;

// Debug


export const HITBOX_DEBUG = {
  enabled: false,
  depth: 300,
  lineWidth: 3,
  alpha: 1,
  metricsUi: {
    enabled: true,
    anchorMode: "progressBar" as "progressBar" | "screen",
    xRatio: 0.5,
    y: 96,
    offsetX: 0,
    offsetY: 45,
    lineGapPx: 48,
    align: "center" as "left" | "center" | "right",
    fontFamily: "monospace",
    fontSizePx: 36,
    fontStyle: "normal" as "normal" | "bold",
    fontStrokeColor: "#000000",
    fontStrokeThickness: 3,
    speedColor: "#fff176",
    distanceColor: "#80d8ff",
    perfColor: "#9cff9c",
    alpha: 1,
    depth: 302,
    roundSpeedKmh: true,
    roundDistanceM: true,
    fpsDecimals: 1,
    frameMsDecimals: 1,
    fpsEmaAlpha: 0.2,
    resizeRateWindowMs: 1000,
  },
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
  initialMs: 80_000,
  bonusMs: 10_000,
} as const;

export const YACHT_TIER_CONFIG = {
  tiers: [
    {
      id: 1,
      speedKmh: 30,
      capacityMultiplier: 1,
      baseTextureKey: "ship-1",
      controlLerpMultiplier: 1,
      targetHeightMultiplier: 0.88,
    },
    {
      id: 2,
      speedKmh: 45,
      capacityMultiplier: 1.5,
      baseTextureKey: "ship-medium-1",
      controlLerpMultiplier: 0.82,
      targetHeightMultiplier: 1,
    },
    {
      id: 3,
      speedKmh: 60,
      capacityMultiplier: 2,
      baseTextureKey: "ship-large-1",
      controlLerpMultiplier: 0.64,
      targetHeightMultiplier: 1.12,
    },
  ] as const,
} as const;

export const ASSETS_SYSTEM_CONFIG = {
  startNormalized: 0.5,
  upgradeAtNormalized: 1,
  resetOnUpgradeNormalized: 0.5,
  loseAtNormalized: 0,
  maxTier: 3,
} as const;

export const SHIELD_ENERGY_CONFIG = {
  pickupNormalizedDelta: 0.025,
  startNormalized: 0,
  autoActivateAtNormalized: 1,
  maxNormalized: 1,
} as const;

export const RED_MAGNET_BUOY_CONFIG = {
  enabled: true,
  rareRatio: 0.3,
  visualTextureKey: "money-down",
  attractRadiusPx: 640,
  attractForcePxPerSec: 1650,
  attractFalloffPower: 0.05,
  maxPushSpeedPxPerSec: 5600,
  minDistancePx: 12,
  axisFactorX: 1,
  axisFactorY: 1,
  behindPullEnabled: false,
  behindPullImpulseMultiplier: 1,
  behindPullMaxReverseSpeedPxPerSec: 120,
  updateCooldownMs: 0,
} as const;

export const WHIRLPOOL_DEBUFF_CONFIG = {
  durationMs: 5_000,
  controlLerpMultiplier: 0.32,
  spinTurnsPerSec: 1.25,
} as const;

export const RUN_COIN_REWARD_CONFIG = {
  baseByTier: [5, 10, 15] as const,
  wheelCoinBonusPerStack: 10,
  portfolioRoundMode: "floor" as "floor" | "round" | "ceil",
} as const;

export const SKILL_WHEEL_STACK_CONFIG = {
  multiplierMin: 2,
  multiplierMax: 4,
  persistence: "run" as "run",
} as const;

export const SKILL_WHEEL_EVENT_CONFIG = {
  enabled: true,
  guaranteedMeters: [600] as const,
  triggerDistanceAheadMeters: -15,
  maxEventsPerRun: 3,
  extra: {
    enabled: true,
    maxExtraEvents: 2,
    windows: [
      { id: "extra-mid", fromMeters: 400, toMeters: 800, chance: 0.55 },
      { id: "extra-late", fromMeters: 800, toMeters: 1200, chance: 0.45 },
    ] as const,
  },
  pause: {
    freezeRunTimer: true,
    freezeWorldUpdates: true,
  },
  islandSpawn: {
    enabled: true,
    minPerRun: 1,
    maxPerRun: 3,
    distanceFromMeters: 400,
    distanceToMeters: 1200,
    minGapMeters: 140,
    allowedPoolIndexFrom: 5,
    allowedPoolIndexTo: 12,
    variantMode: "alternate" as "alternate" | "random",
    randomWeights: {
      wheelIsland1: 1,
      wheelIsland2: 1,
    },
  },
} as const;

export const SKILL_WHEEL_REWARD_CONFIG = {
  enabled: true,
  maxActiveRewards: 4,
  defaultDurationMs: 0,
  duplicatePolicy: "refreshOnly" as "refreshOnly" | "stackDuration",
  removeOnRunEnd: true,
  rewards: {
    assets_mult: {
      key: "skill-wheel-bonus-1",
      resultKey: "skill-wheel-sector-1",
      durationMs: 0,
      multiplier: 2,
      title: "x2",
      bodyLine1: "Стоимость собранных активов\nувеличивается x2.",
      bodyLine2: "Шкала активов заполняется быстрее!",
    },
    time_mult: {
      key: "skill-wheel-bonus-3",
      resultKey: "time-bonus",
      durationMs: 0,
      multiplier: 2,
      title: "x2",
      bodyLine1: "Бонус времени даёт\nв 2 раза больше секунд.",
      bodyLine2: "Легче добраться до гавани.",
    },
    energy_mult: {
      key: "energy-bonus",
      resultKey: "energy-bonus",
      durationMs: 0,
      multiplier: 2,
      title: "x2",
      bodyLine1: "Собранная энергия даёт\nв 2 раза больше энергии!",
      bodyLine2: "Щит активов становится\nдоступным быстрее!",
    },
    coin_plus_10: {
      key: "coin",
      resultKey: "coin",
      durationMs: 0,
      title: "+10",
      bodyLine1: "Получи + 10 монет в гавани!",
      bodyLine2: "Здесь всё просто :)",
    },
  } as const,
} as const;

export const WHEEL_ISLAND_CONFIG = {
  damageEnabled: false,
} as const;

export const WHEEL_DEBUG_CONFIG = {
  forceOpenOnCreate: false,
  logRewards: false,
} as const;

export const RUN_START_SPEED = {
  startDropKmh: 0,
} as const;

export const RUN_CINEMATIC_CONFIG = {
  intro: {
    enabled: true,
    freezeGameplay: true,
    disableInput: true,
    disableCollisions: true,
    disableRunTimer: true,
    disableSkillWheel: true,
    spawnOffsetFromBottomPx: 180,
    travelDurationMs: 1800,
    travelEase: "Sine.easeOut",
    startAlpha: 1,
    endAlpha: 1,
    startScale: 0.96,
    endScale: 1,
    speedRampEnabled: true,
    speedRampDurationMs: 1_000,
    speedRampEase: "Sine.easeInOut",
    startWorldSpeedScale: 0,
    endWorldSpeedScale: 1,
    holdAfterArrivalMs: 0,
    goText: {
      enabled: true,
      text: "ВПЕРЁД!",
      showDelayMs: 1200,
      depth: 260,
      position: {
        mode: "screenRatio" as "screenRatio" | "relativeToYacht",
        xRatio: 0.5,
        yRatio: 0.6,
        offsetX: 0,
        offsetY: -200,
        clampToViewport: true,
      },
      style: {
        fontFamily: "Fascinate",
        fontSizePx: 108,
        fontStyle: "bold",
        color: "#FFFFFF",
        align: "center" as "left" | "center" | "right",
        stroke: {
          enabled: false,
          color: "#000000",
          thicknessPx: 0,
          alpha: 1,
        },
        shadow: {
          enabled: false,
          color: "#000000",
          blurPx: 0,
          offsetX: 0,
          offsetY: 0,
          alpha: 0.35,
        },
        originX: 0.5,
        originY: 0.5,
      },
      scale: {
        from: 0,
        to: 1,
        outTo: 0,
        inDurationMs: 300,
        holdDurationMs: 900,
        outDurationMs: 300,
        inEase: "Back.easeOut",
        outEase: "Sine.easeIn",
      },
      alpha: {
        from: 1,
        to: 1,
        outTo: 0,
        linkToScaleTimeline: true,
      },
      yHop: {
        enabled: true,
        upPx: 64,
        upDurationMs: 150,
        downDurationMs: 230,
        upEase: "Sine.easeOut",
        downEase: "Sine.easeInOut",
        settleToStartY: false,
      },
      lifecycle: {
        autoDestroyOnComplete: true,
        killOnIntroStop: true,
        killOnSceneShutdown: true,
      },
      debug: {
        logLifecycle: false,
      },
    },
    debug: {
      logLifecycle: false,
    },
  },
  death: {
    enabled: true,
    freezeGameplay: true,
    disableInput: true,
    disableCollisions: true,
    disableRunTimer: true,
    disableSkillWheel: true,
    triggerReasons: {
      hit_hazard: true,
      out_of_time: true,
      assets_empty: true,
    },
    preLiftY: 72,
    preLiftDurationMs: 220,
    preLiftEase: "Sine.easeOut",
    rotationTurns: 2.2,
    rotationDirection: "auto" as "cw" | "ccw" | "auto",
    rotationDurationMs: 900,
    rotationEase: "Sine.easeIn",
    fallDistanceToOffscreenPx: 520,
    fallExtraBottomPaddingPx: 120,
    fallDurationMs: 900,
    fallEase: "Sine.easeIn",
    fadeOutEnabled: false,
    fadeOutStartMs: 520,
    fadeOutDurationMs: 380,
    fallSpeedDampen: {
      enabled: true,
      durationMs: 1_000,
      ease: "Sine.easeOut",
      fromScale: 1,
      toScale: 0,
    },
    resultTransition: {
      onCompleteOnly: true,
      fallbackTimeoutMs: 4_000,
    },
    debug: {
      logLifecycle: false,
    },
  },
} as const;

export const RUN_SPEED_RAMP = {
  legacyDistanceRampEnabled: false,
  startKmh: 30,
  everyMeters: 100,
  addKmhPerStep: 5,
  maxKmh: 60,
  maxAtMeters: 1200,
  baseRecoverKmhPerSec: 24,
} as const;

export const OBSTACLE_SLOWDOWN = {
  enabled: true,
  hitDurationMs: 1_250,
  dropKmh: 22,
  decelKmhPerSec: 45,
  recoverKmhPerSec: 30,
} as const;

// Прогресс и чекпоинты


export const LANDMARK_METERS = {
  harbor: 1250,
} as const;

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
  moneyDown: 0.2,
  moneyDownMagnet: 0.2,
  dynamicDown: 0.4,
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
    moneyDownMagnet: true,
    dynamicBuoy: true,
    mine: false,
    pirate: false,
    whirlpool: false,
  },
  allowNonBlockingHazards: {
    moneyDown: false,
    moneyDownMagnet: false,
    dynamicBuoy: false,
    mine: false,
    pirate: false,
    whirlpool: true,
  },
  solids: {
    rock1: true,
    rock2: true,
    rock3: true,
    reef1: true,
    wheelIsland1: true,
    wheelIsland2: true,
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
      mid: 1,
      late: 2,
      endgame: 3,
    },
    dynamicBuoyMinFromPoolIndex: 3,
    dynamicBuoyMinDefault: 1,
    reefMin: 1,
  },
  guaranteedSpawnPaddingMeters: {
    min: 6,
    max: 6,
  },
  wheelIslandExclusion: {
    enabled: true,
    radiusMeters: 20,
    minDeltaXRatio: 0.18,
    blockedTypes: ["moneyDown", "moneyDownMagnet", "dynamicBuoy", "whirlpool", "reef1", "rock1", "rock2", "rock3"] as const,
    allowTimeBonus: true,
    allowSpeedBonus: true,
    allowCoin: false,
    resampleAttempts: 10,
  },
} as const;

export const SEGMENT_PICKUP_RULES = {
  energy: {
    totalCount: 100,
    onePerSegment: false,
    spawnRangeStartMeters: 0,
    spawnRangeEndMeters: 1250,
    xRatioMin: 0.22,
    xRatioMax: 0.78,
    minGapMeters: 14,
    minDeltaXRatio: 0.10,
    maxPlacementAttempts: 300,
  },
  speedBonus: {
    xRatioMin: 0.22,
    xRatioMax: 0.78,
  },
} as const;

export const SEGMENT_GLOBAL_BONUS_SPAWN = {
  enabled: true,
  fromSegments: false,
  maxPerPool: 1,
  maxPerPoolByType: {
    speedBonus: 1,
    timeBonus: 1,
  },
  safety: {
    enabled: true,
    perTypeEnabled: {
      speedBonus: true,
      timeBonus: true,
    },
    blockingTypes: ["moneyDown", "moneyDownMagnet", "dynamicBuoy", "whirlpool", "reef1", "rock1", "rock2", "rock3"] as const,
    minDeltaMeters: 7,
    minDeltaXRatio: 0.12,
    maxResampleAttempts: 18,
    resampleMeterJitterMeters: 9,
    safeXRatioMin: 0.2,
    safeXRatioMax: 0.8,
  },
  rulesByType: {
    speedBonus: {
      enabled: true,
      spawnRange: {
        fromMeters: 0,
        toMeters: 600,
        endExclusive: true,
      },
      windows: [
        { id: "speed-early", fromMeters: 0, toMeters: 260, weight: 1.2 },
        { id: "speed-mid", fromMeters: 260, toMeters: 600, weight: 1 },
      ],
      countMode: "hybrid" as "fixed" | "variable" | "hybrid",
      defaultMode: "fixed" as "fixed" | "variable",
      fixedCount: 3,
      variable: {
        targetPerRun: 3,
        varianceMin: -1,
        varianceMax: 1,
        minPerRun: 2,
        maxPerRun: 4,
      },
      placement: {
        xRatioMin: 0.22,
        xRatioMax: 0.78,
        minGapMeters: 130,
        attemptsPerBonus: 36,
        maxPerPool: 1,
      },
    },
    timeBonus: {
      enabled: true,
      spawnRange: {
        fromMeters: 600,
        toMeters: 1250,
        endExclusive: false,
      },
      windows: [
        { id: "time-early", fromMeters: 600, toMeters: 860, weight: 1 },
        { id: "time-mid", fromMeters: 860, toMeters: 1080, weight: 1.15 },
        { id: "time-late", fromMeters: 1080, toMeters: 1250, weight: 0.95 },
      ],
      countMode: "hybrid" as "fixed" | "variable" | "hybrid",
      defaultMode: "fixed" as "fixed" | "variable",
      fixedCount: 3,
      variable: {
        targetPerRun: 3,
        varianceMin: -1,
        varianceMax: 1,
        minPerRun: 2,
        maxPerRun: 4,
      },
      placement: {
        xRatioMin: 0.22,
        xRatioMax: 0.78,
        minGapMeters: 130,
        attemptsPerBonus: 36,
        maxPerPool: 1,
      },
    },
  },
} as const;

export const SEGMENT_COIN_SAFETY = {
  enabled: true,
  blockingTypes: [
    "moneyDown",
    "moneyDownMagnet",
    "dynamicBuoy",
    "whirlpool",
    "reef1",
    "rock1",
    "rock2",
    "rock3",
    "wheelIsland1",
    "wheelIsland2",
  ] as const,
  minDeltaMeters: 7,
  minDeltaXRatio: 0.12,
  maxResampleAttempts: 18,
  resampleMeterJitterMeters: 7,
  safeXRatioMin: 0.2,
  safeXRatioMax: 0.8,
  finalFillExtraAttemptsMultiplier: 3,
} as const;

// Анимации наград и сбора

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
  controlModelByPlatform: {
    desktop: "anchorRebase" as "delta" | "anchorRebase",
    mobile: "anchorRebase" as "delta" | "anchorRebase",
  },
  anchorRebase: {
    enabled: true,
    rebaseOnExternalDisplacement: true,
    debug: {
      logAnchorLifecycle: true,
      logRebase: true,
    },
  },
} as const;

export const RELATIVE_TOUCH_CONTROL = {
  desktop: {
    requirePointerDown: true,
    gainX: 1,
    gainY: 1,
    deadZonePx: 1,
    maxDeltaXPerEventPx: 120,
    maxDeltaYPerEventPx: 120,
    targetLerpPerSecX: 20,
    targetLerpPerSecY: 20,
    bodyLerpPerSecX: 34,
    bodyLerpPerSecY: 34,
    snapDistancePx: 0,
    minXPaddingPx: 12,
    maxXPaddingPx: 12,
    minYPaddingPx: 12,
    maxYPaddingPx: 12,
    anchor: {
      pointerJitterDeadZonePx: 0,
      pointerSmoothingLerpPerSec: 120,
      recalcOffsetOnPointerDown: true,
      clampDesiredTargetAfterAnchor: true,
      keepAnchorDuringCollision: true,
    },
    rebase: {
      minDisplacementPx: 0,
      axisThresholdX: 0,
      axisThresholdY: 0,
      axisFactorX: 1.35,
      axisFactorY: 1.2,
      bodyDyToTargetDyFactor: 1.2,
      maxRebasePerEventPxX: 260,
      maxRebasePerEventPxY: 260,
      clampAnchorOffset: true,
      maxAnchorOffsetPxX: 900,
      maxAnchorOffsetPxY: 1200,
      immediateDesiredSync: true,
      immediateTargetSync: true,
      cooldownMs: 0,
    },
  },
  mobile: {
    requirePointerDown: true,
    gainX: 1,
    gainY: 1,
    deadZonePx: 1,
    maxDeltaXPerEventPx: 120,
    maxDeltaYPerEventPx: 120,
    targetLerpPerSecX: 40,
    targetLerpPerSecY: 40,
    bodyLerpPerSecX: 38,
    bodyLerpPerSecY: 38,
    snapDistancePx: 0,
    minXPaddingPx: 0,
    maxXPaddingPx: 0,
    minYPaddingPx: 0,
    maxYPaddingPx: 0,
    anchor: {
      pointerJitterDeadZonePx: 0,
      pointerSmoothingLerpPerSec: 140,
      recalcOffsetOnPointerDown: true,
      clampDesiredTargetAfterAnchor: true,
      keepAnchorDuringCollision: true,
    },
    rebase: {
      minDisplacementPx: 0,
      axisThresholdX: 0,
      axisThresholdY: 0,
      axisFactorX: 1.5,
      axisFactorY: 1.3,
      bodyDyToTargetDyFactor: 1.25,
      maxRebasePerEventPxX: 320,
      maxRebasePerEventPxY: 320,
      clampAnchorOffset: true,
      maxAnchorOffsetPxX: 1200,
      maxAnchorOffsetPxY: 1600,
      immediateDesiredSync: true,
      immediateTargetSync: true,
      cooldownMs: 0,
    },
  },
} as const;

// Визуал и движение яхты


export const YACHT_VISUAL_SIZE = {
  targetHeightPx: 280,
  hitboxWidthRatioToVisual: 0.32,
  hitboxHeightRatioToVisual: 0.74,
  minHitboxWidthPx: 84,
  minHitboxHeightPx: 184,
  hitboxOffsetX: 0,
  hitboxOffsetY: 30,
} as const;

export const YACHT_TEXTURE_VISUAL_SCALE_CORRECTION = {
  "ship-1": {
    scaleX: 1.649,
    scaleY: 1.105,
  },
  "ship-2": {
    scaleX: 1.649,
    scaleY: 1.105,
  },
  "ship-3": {
    scaleX: 1.649,
    scaleY: 1.105,
  },
  "ship-4": {
    scaleX: 1.649,
    scaleY: 1.105,
  },
  "ship-5": {
    scaleX: 1.649,
    scaleY: 1.105,
  },
  "ship-medium-1": {
    scaleX: 1.193,
    scaleY: 1.043,
  },
  "ship-large-1": {
    scaleX: 1.039,
    scaleY: 0.932,
  },
} as const;

export const YACHT_VISUAL_OFFSET = {
  y: 32,
} as const;

export const YACHT_VISUAL_DEPTH = 14;

export const YACHT_START_POSITION = {
  xRatio: 0.5,
  yRatio: 0.66,
  offsetX: 0,
  offsetY: 0,
  clampToControlBounds: true,
} as const;

export const YACHT_SWAY = {
  amplitudePx: 6,
  frequencyHz: 2.2,
} as const;

export const YACHT_SPEED_Y_ANIM = {
  accelOffsetPx: 160,
  accelDurationMs: 270,
  accelReturnMs: 720,
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

export const SHIP_STAGE_TRANSITION = {
  enabled: true,
  durationMs: 600,
  ease: "Sine.easeOut",
  minIntervalMs: 120,
  minIntervalBehavior: "queue" as "queue" | "instant",
  interruptPolicy: "replace" as "replace" | "skip",
  respectShieldBlink: false,
  incomingAlphaFrom: 0,
  incomingAlphaTo: 1,
  outgoingAlphaFrom: 1,
  outgoingAlphaTo: 0,
  scale: {
    enabled: true,
    from: 1,
    to: 2,
  },
} as const;

// Хитбоксы и блокеры яхты

export const YACHT_HAZARD_HITBOX = {
  widthRatioToVisual: 0.32,
  heightRatioToVisual: 0.74,
  minWidthPx: 84,
  minHeightPx: 184,
  offsetX: 0,
  offsetY: 30,
} as const;

export const YACHT_SOLID_BLOCKERS = {
  rock1: false,
  rock2: false,
  rock3: false,
  reef1: false,
  wheelIsland1: true,
  wheelIsland2: true,
  harbor: false,
} as const;

export const YACHT_SOLID_CONTACT_RESOLVE = {
  minSeparationPx: 1,
  axisTieEpsilonPx: 1.5,
  syncTargetsAfterResolve: true,
} as const;

export const SOLID_CONTACT_FEEDBACK = {
  default: {
    applySlowdown: true,
    shipBlink: true,
    redOverlay: true,
  },
  byType: {
    reef1: {
      applySlowdown: true,
      shipBlink: true,
      redOverlay: false,
    },
  },
} as const;

// Щит и feedback-эффекты


export const ASSET_SHIELD_CONFIG = {
  enable: true,
  activation: {
    manualOnly: false,
    fuelReadyThreshold: SHIELD_ENERGY_CONFIG.autoActivateAtNormalized,
    allowManualStop: false,
  },
  runtime: {
    durationMs: 5_000,
    timerEnabled: false,
    drainEnabled: true,
    drainPerSec: 0.125,
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
    affectedHazards: ["moneyDown", "moneyDownMagnet", "dynamicDown", "whirlpool"] as const,
    contactPushEnabled: true,
    contactPushByType: {
      moneyDown: {
        impulsePxPerSec: 560,
        separationPx: 14,
        verticalImpulseFactor: 0.3,
        maxVerticalPushPxPerSec: 180,
        cooldownMs: 120,
      },
      moneyDownMagnet: {
        impulsePxPerSec: 620,
        separationPx: 18,
        verticalImpulseFactor: 0.3,
        maxVerticalPushPxPerSec: 200,
        cooldownMs: 120,
      },
      dynamicDown: {
        impulsePxPerSec: 560,
        separationPx: 14,
        verticalImpulseFactor: 0.3,
        maxVerticalPushPxPerSec: 180,
        cooldownMs: 120,
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
        moneyDownMagnet: true,
        dynamicDown: true,
      },
      originOffsetX: 0,
      originOffsetY: 0,
      radiusPx: 300,
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
        enabled: false,
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
  moneyUp: { width: 86, height: 120 },
} as const;

export const MONEY_UP_HITBOX = {
  radiusXRatio: 3,
  radiusYRatio: 4,
  centerXRatio: 5,
  centerYRatio: 6,
} as const;

export const MONEY_DOWN_CONFIG = {
  textureKey: "money-down",
  width: 86,
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

export const MONEY_DOWN_MAGNET_CONFIG = {
  textureKey: "money-down",
  width: 86,
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
    fuelPenalty: 0.2,
  },
  no: {
    textureKey: "money-change-no",
  },
} as const;

export const DYNAMIC_BUOY_CONFIG = {
  width: 83,
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
      displayWidth: 83,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
    no: {
      displayWidth: 83,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
    down: {
      displayWidth: 83,
      displayHeight: 120,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
    },
  },
} as const;

// Препятствия

export const WHIRLPOOL_CONFIG = {
  textureKey: "obstacle-whirlpool",
  width: 156,
  height: 117,
  depth: 12,
  speedYMultiplier: 1,
  driftAmplitudePx: 0,
  driftFrequencyHz: 1.2,
  driftPhaseMin: 0,
  driftPhaseMax: Math.PI * 2,
  swayAmplitudeDeg: 0,
  swayFrequencyHz: 0,
  hitbox: {
    radiusXRatio: 1.442,
    radiusYRatio: 1.218,
    centerXRatio: 2.163,
    centerYRatio: 2.144,
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
    damageEnabled: true,
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
      radiusXRatio: 0.75,
      radiusYRatio: 0.5,
      centerXRatio: 1,
      centerYRatio: 1.6,
    },
  },
} as const;

export const REEF_CONFIG = {
  common: {
    depth: 13,
    speedYMultiplier: 1,
    damageEnabled: true,
    collisionCooldownMs: 220,
    allowPartialSpawn: true,
    partialSpawnMaxOffsetPx: 120,
    applyImpactAnimation: false,
  },
  reef1: {
    textureKey: "obstacle-reef-1",
    width: 219,
    height: 203,
    ellipse: {
      radiusXRatio: 1.5,
      radiusYRatio: 1,
      centerXRatio: 2,
      centerYRatio: 2.5,
    },
  },
} as const;

// Пикапы


export const TIME_BONUS = {
  textureKey: "time-bonus",
  shadowTextureKey: "time-bonus-shadow",
  spawnYOffset: -120,
  width: 82,
  height: 84,
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
    widthRatio: 1.951,
    heightRatio: 1.905,
    offsetX: 99,
    offsetY: 98,
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

export const WIND_SPEED_BONUS_CONFIG = {
  textureKey: "wind-speed-bonus",
  shadowTextureKey: "wind-speed-bonus-shadow",
  spawnYOffset: -120,
  width: 150,
  height: 300,
  shadowWidth: 150,
  shadowHeight: 300,
  shadowYOffset: 12,
  shadowAlpha: 0.34,
  depth: 20,
  shadowDepth: 8,
  speedYMultiplier: 1,
  zigzagHorizontalSpeed: 0,
  zigzagLeftBoundOffset: 0,
  zigzagRightBoundOffset: 0,
  yBobAmplitudePx: 8,
  yBobFrequencyHz: 0.5,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  hitbox: {
    widthRatio: 1.25,
    heightRatio: 1.75,
    offsetX: 50,
    offsetY: 100,
  },
  pulse: {
    baseScale: 1,
    amplitude: 0.035,
    frequencyHz: 0.9,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
    minScale: 0.94,
    maxScale: 1.08,
    affectHitbox: true,
  },
  shadowBobScale: {
    baseScaleX: 0.34,
    baseScaleY: 0.34,
    responseX: 0.045,
    responseY: 0.06,
    minScaleX: 0.22,
    maxScaleX: 0.48,
    minScaleY: 0.2,
    maxScaleY: 0.5,
  },
  shadowPulse: {
    amplitudeX: 0.03,
    amplitudeY: 0.04,
    frequencyHz: 0.9,
    phaseOffsetRad: 0.6,
    minScaleX: 0.92,
    maxScaleX: 1.08,
    minScaleY: 0.9,
    maxScaleY: 1.1,
  },
  fadeOutOnCollect: {
    enabled: true,
    durationMs: 1_000,
    delayMs: 0,
    ease: "Linear",
    freezeMotionOnStart: true,
    disableBodyOnStart: true,
    destroySpriteOnComplete: true,
    sprite: {
      useCurrentAlphaAsStart: true,
      startAlpha: 1,
      endAlpha: 0,
      hideWhenComplete: true,
      stopPulseDuringFade: false,
      stopYBobDuringFade: false,
    },
    shadow: {
      enabled: true,
      useCurrentAlphaAsStart: true,
      startAlpha: 0.34,
      endAlpha: 0,
      followSpriteDuringFade: true,
      stopPulseDuringFade: true,
      destroyOnComplete: true,
      hideWhenComplete: true,
    },
    debug: {
      logLifecycle: false,
    },
  },
} as const;

export const SPEED_BONUS_CONFIG = {
  runtime: {
    behaviorMode: "classic" as "classic" | "wind",
    enabledInSpawn: true,
    windEnabledInSpawn: false,
  },
  textureKey: "speed-bonus",
  shadowTextureKey: "speed-bonus-shadow",
  spawnYOffset: -120,
  width: 107,
  height: 91,
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
    widthRatio: 1.495,
    heightRatio: 1.758,
    offsetX: 87,
    offsetY: 95,
  },
  pulse: {
    baseScale: 1,
    amplitude: 0.035,
    frequencyHz: 0.9,
    phaseMin: 0,
    phaseMax: Math.PI * 2,
    minScale: 0.94,
    maxScale: 1.08,
    affectHitbox: true,
  },
  effectDurationMs: 5_000,
  speedMultiplier: 1.5,
  transition: {
    rampUpKmhPerSec: 12,
    rampDownKmhPerSec: 16,
    minRampUpKmhPerSec: 4,
    maxRampUpKmhPerSec: 40,
    minRampDownKmhPerSec: 4,
    maxRampDownKmhPerSec: 40,
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
  shadowPulse: {
    amplitudeX: 0.03,
    amplitudeY: 0.04,
    frequencyHz: 0.9,
    phaseOffsetRad: 0.6,
    minScaleX: 0.92,
    maxScaleX: 1.08,
    minScaleY: 0.9,
    maxScaleY: 1.1,
  },
  fadeOutOnCollect: {
    enabled: true,
    durationMs: 1_000,
    delayMs: 0,
    ease: "Linear",
    freezeMotionOnStart: true,
    disableBodyOnStart: true,
    destroySpriteOnComplete: true,
    sprite: {
      useCurrentAlphaAsStart: true,
      startAlpha: 1,
      endAlpha: 0,
      hideWhenComplete: true,
      stopPulseDuringFade: false,
      stopYBobDuringFade: false,
    },
    shadow: {
      enabled: true,
      useCurrentAlphaAsStart: true,
      startAlpha: 0.34,
      endAlpha: 0,
      followSpriteDuringFade: true,
      stopPulseDuringFade: true,
      destroyOnComplete: true,
      hideWhenComplete: true,
    },
    debug: {
      logLifecycle: false,
    },
  },
} as const;

export const COIN_CONFIG = {
  textureKey: "energy-bonus",
  shadowTextureKey: "coin-shadow",
  width: 69,
  height: 81,
  shadowWidth: 52,
  shadowHeight: 16,
  shadowYOffset: 82,
  shadowAlpha: 0.45,
  depth: 20,
  shadowDepth: 8,
  speedYMultiplier: 1,
  yBobAmplitudePx: 30,
  yBobFrequencyHz: 0.76,
  yBobPhaseMin: 0,
  yBobPhaseMax: Math.PI * 2,
  hitbox: {
    widthRatio: 4.638,
    heightRatio: 7.704,
    offsetX: 248,
    offsetY: 324,
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
  wheelIsland1: {
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
  wheelIsland2: {
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
