import Phaser from "phaser";
import {
  ASSET_SHIELD_CONFIG,
  ASSETS_BAR_UI,
  BRAKING,
  BUOY_COLLISION_LAYER,
  COIN_CONFIG,
  COIN_UI_CONFIG,
  COLLECT_ANIMATION_BUOY,
  COLLECT_ANIMATION_TIME_BONUS,
  DYNAMIC_BUOY_BLINK,
  DYNAMIC_BUOY_CONFIG,
  DYNAMIC_BUOY_STATES,
  FALL_SPEED,
  GREEN_HIT_FEEDBACK,
  HAZARD_COLLISION,
  HAZARD_DAMAGE,
  LANDMARK_METERS,
  IMPACT_ANIMATION,
  LANDMARK_CONFIG,
  MINE_CONFIG,
  MONEY_DOWN_CONFIG,
  OBSTACLE_SLOWDOWN,
  OBJECT_SIZES,
  PIRATE_CONFIG,
  PLAY_AREA,
  RED_HIT_INVULNERABILITY,
  RED_HIT_OVERLAY_EFFECT,
  RELATIVE_TOUCH_CONTROL,
  RELATIVE_TOUCH_ROUTING,
  ROCK_CONFIG,
  RUN_SPEED_RAMP,
  RUN_START_SPEED,
  RUN_TIMER,
  SEGMENT_PICKUP_RULES,
  SEGMENT_SPAWN,
  SHIP_ASSET_STAGES,
  SPEED_BONUS_CONFIG,
  TIME_UI_CONFIG,
  TIME_BONUS,
  TOP_PROGRESS_BAR_CONFIG,
  TUNING,
  WATER_SCROLL,
  WHIRLPOOL_CONFIG,
  YACHT_HAZARD_HITBOX,
  YACHT_SOLID_COLLISION,
  YACHT_SOLID_BLOCKERS,
  YACHT_SPEED_Y_ANIM,
  YACHT_SWAY,
  YACHT_VISUAL_OFFSET,
  YACHT_VISUAL_SIZE,
} from "../config/tuning";
import {
  FINAL_SEGMENT_1200_1250,
  LEVEL_SEGMENT_POOLS,
  type SegmentObjectDef,
  type SegmentObjectType,
  type SegmentTemplate,
} from "../config/level_segments";

type SuccessReason = "success_harbor_610";
type FailureReason = "out_of_time" | "hit_hazard";
type ResultReason = FailureReason | SuccessReason;
type ControlPlatform = "desktop" | "mobile";
type HazardType = "mine" | "pirate" | "moneyDown" | "dynamicBuoy" | "whirlpool";
type SolidType = "rock1" | "rock2" | "rock3" | "island1" | "island2" | "harbor";
type CollectAnimationType = "buoy" | "timeBonus" | "speedBonus";
type AirBonusType = "time" | "speed";
type DynamicBuoyGameplayState = "up" | "down";
type DynamicBuoyVisualState = DynamicBuoyGameplayState | "no";
type ShieldButtonState = "disabled" | "ready" | "active";
type ShieldHazardKey = (typeof ASSET_SHIELD_CONFIG.invulnerability.affectedHazards)[number];
type BuoyCollisionActorType = "moneyUp" | HazardType;

type EllipseHitbox = {
  radiusXRatio: number;
  radiusYRatio: number;
  centerXRatio: number;
  centerYRatio: number;
};

type EllipseHitboxParams = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
};

type ScheduledSegmentObject = SegmentObjectDef & {
  scheduleId: string;
  spawnMeter: number;
};

type ShieldTapCandidate = {
  pointerId: number;
  startX: number;
  startY: number;
  startAtMs: number;
};

const MONEY_UP_TEXTURE_KEY = "money-up";
const MONEY_UP_DEPTH = 13;
const MONEY_UP_SPEED_MULTIPLIER = 0.8;
const MONEY_UP_DRIFT_AMPLITUDE_PX = 10;
const MONEY_UP_DRIFT_FREQUENCY_HZ = 1.1;
const MONEY_UP_SWAY_AMPLITUDE_DEG = 4;
const MONEY_UP_SWAY_FREQUENCY_HZ = 1.1;
const MONEY_UP_HITBOX = {
  radiusXRatio: 0.36,
  radiusYRatio: 0.46,
  centerXRatio: 0.5,
  centerYRatio: 0.58,
} as const;

export default class GameScene extends Phaser.Scene {
  private water?: Phaser.GameObjects.TileSprite;
  private coinsText?: Phaser.GameObjects.Text;
  private topProgressGraphics?: Phaser.GameObjects.Graphics;
  private topProgressShipMarker?: Phaser.GameObjects.Image;
  private topProgressFlag?: Phaser.GameObjects.Image;
  private assetsBarGraphics?: Phaser.GameObjects.Graphics;
  private timePanelGraphics?: Phaser.GameObjects.Graphics;
  private timeText?: Phaser.GameObjects.Text;

  private yachtBody?: Phaser.Physics.Arcade.Sprite;
  private yachtHazardCollider?: Phaser.Physics.Arcade.Sprite;
  private yachtVisual?: Phaser.GameObjects.Image;

  private hazards!: Phaser.Physics.Arcade.Group;
  private moneyUps!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;
  private timeBonuses!: Phaser.Physics.Arcade.Group;
  private solids!: Phaser.Physics.Arcade.Group;
  private harborGate?: Phaser.Physics.Arcade.Image;

  private targetX = 0;
  private targetY = 0;
  private playAreaLeft = 0;
  private playAreaRight = 0;
  private controlMinX = 0;
  private controlMaxX = 0;
  private controlMinY = 0;
  private controlMaxY = 0;

  private pointerControlActive = false;
  private pointerControlId?: number;
  private activeControlPlatform: ControlPlatform = RELATIVE_TOUCH_ROUTING.manualPlatform;
  private pointerLastX = 0;
  private pointerLastY = 0;
  private pointerFrameDeltaX = 0;
  private pointerFrameDeltaY = 0;
  private desiredTargetX = 0;
  private desiredTargetY = 0;

  private yMotionOffsetPx = 0;
  private yachtSpeedMotionOutTween?: Phaser.Tweens.Tween;
  private yachtSpeedMotionReturnTween?: Phaser.Tweens.Tween;
  private swayTime = 0;

  private redInvulActive = false;
  private redInvulTimer?: Phaser.Time.TimerEvent;
  private redOverlayTimer?: Phaser.Time.TimerEvent;
  private redShipBlinkTween?: Phaser.Tweens.Tween;
  private greenShipTintTween?: Phaser.Tweens.Tween;
  private redOverlay?: Phaser.GameObjects.Rectangle;
  private shieldShipBlinkTween?: Phaser.Tweens.Tween;

  private shieldActive = false;
  private shieldRemainingMs = 0;
  private shieldButtonState: ShieldButtonState = "disabled";
  private shieldButtonCircle?: Phaser.GameObjects.Arc;
  private shieldButtonLabel?: Phaser.GameObjects.Text;
  private shieldButtonTween?: Phaser.Tweens.Tween;
  private shieldButtonLastTapAtMs = Number.NEGATIVE_INFINITY;
  private shieldTapCandidate?: ShieldTapCandidate;

  private shieldVisual?: Phaser.GameObjects.Graphics;
  private shieldVisualTween?: Phaser.Tweens.Tween;
  private shieldVisualActivation = 0;
  private shieldVisualScaleFactor = 1;

  private isGameOver = false;
  private speedKmh = Math.max(0, TUNING.SPEED_START_KMH - RUN_START_SPEED.startDropKmh);
  private distanceM = 0;
  private assetsValue = TUNING.FUEL_START;
  private remainingTimeMs = RUN_TIMER.initialMs;

  private coinsCollected = 0;
  private coinsScheduledTotal = 0;

  private speedBonusRemainingMs = 0;
  private speedBonusLockedKmh?: number;
  private speedBonusDecayActive = false;
  private obstacleSlowdownUntilMs = Number.NEGATIVE_INFINITY;

  private scheduledObjects: ScheduledSegmentObject[] = [];
  private scheduledObjectCursor = 0;

  private collisionPairLastHit = new Map<string, number>();
  private buoyCollisionPairLastHit = new Map<string, number>();
  private collisionIdCounter = 0;
  private solidDamageLastHit = new Map<number, number>();

  private readonly onPointerDown = (pointer: Phaser.Input.Pointer) => {
    if (this.pointerControlActive && this.pointerControlId !== pointer.id) {
      return;
    }

    if (this.tryStartShieldTapCandidate(pointer)) {
      return;
    }

    this.startPointerControlWithPointer(pointer);
  };

  private readonly onPointerUp = (pointer: Phaser.Input.Pointer) => {
    if (this.tryCompleteShieldTapCandidate(pointer)) {
      return;
    }

    if (!this.isPointerControlPointer(pointer)) {
      return;
    }

    this.resetPointerControlState();
  };

  private readonly onPointerMove = (pointer: Phaser.Input.Pointer) => {
    if (this.tryPromoteShieldTapCandidateToControl(pointer)) {
      return;
    }

    const platform = this.resolveControlPlatformForPointer(pointer);
    const controlProfile = this.getControlProfileForPlatform(platform);
    if (!this.isPointerControlPointer(pointer)) {
      if (this.pointerControlActive || controlProfile.requirePointerDown) {
        return;
      }

      this.startPointerControlWithPointer(pointer);
      return;
    }

    if (platform !== this.activeControlPlatform) {
      this.activeControlPlatform = platform;
      this.updateControlBoundsForPlatform(platform);
    }
    this.updatePointerFrameDelta(pointer);
  };

  constructor() {
    super("Game");
  }

  create() {
    this.resetState();
    const { width, height } = this.scale;

    this.createWaterBackground(width, height);
    this.createObjectTextures();
    this.createHud(width, height);
    this.createYacht(width, height);
    this.createShieldUi(width, height);
    this.setupInput();
    this.createGroups();
    this.setupCollisions();
    this.buildRunSegmentSchedule();
    this.updateTimerHud();
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) {
      return;
    }

    const dt = delta / 1000;
    this.remainingTimeMs = Math.max(0, this.remainingTimeMs - delta);
    if (this.remainingTimeMs <= 0) {
      this.finishRunOutOfTime();
      return;
    }

    const speedBonusWasActive = this.speedBonusRemainingMs > 0;
    if (speedBonusWasActive) {
      this.speedBonusRemainingMs = Math.max(0, this.speedBonusRemainingMs - delta);
    }
    const speedBonusIsActive = this.speedBonusRemainingMs > 0;
    if (speedBonusWasActive && !speedBonusIsActive) {
      this.speedBonusDecayActive = true;
      this.speedBonusLockedKmh = undefined;
    }

    const baseSpeedKmh = this.getBaseSpeedKmhByDistance(this.distanceM);
    let speedTargetKmh = baseSpeedKmh;
    let speedStepKmh = BRAKING.recoverKmhPerSec * dt;

    if (speedBonusIsActive) {
      const lockedBonusSpeed = this.speedBonusLockedKmh ?? baseSpeedKmh * SPEED_BONUS_CONFIG.speedMultiplier;
      this.speedBonusLockedKmh = lockedBonusSpeed;
      speedTargetKmh = lockedBonusSpeed;
      speedStepKmh = SPEED_BONUS_CONFIG.transition.rampUpKmhPerSec * dt;
      this.speedBonusDecayActive = false;
    } else if (this.speedBonusDecayActive) {
      speedTargetKmh = baseSpeedKmh;
      speedStepKmh = SPEED_BONUS_CONFIG.transition.rampDownKmhPerSec * dt;
    } else if (OBSTACLE_SLOWDOWN.enabled && this.time.now < this.obstacleSlowdownUntilMs) {
      speedTargetKmh = Math.max(0, baseSpeedKmh - OBSTACLE_SLOWDOWN.dropKmh);
      speedStepKmh = OBSTACLE_SLOWDOWN.decelKmhPerSec * dt;
    } else {
      speedTargetKmh = baseSpeedKmh;
      speedStepKmh = OBSTACLE_SLOWDOWN.recoverKmhPerSec * dt;
    }

    this.speedKmh = this.moveTowardValue(this.speedKmh, speedTargetKmh, speedStepKmh);
    if (this.speedBonusDecayActive && Math.abs(this.speedKmh - baseSpeedKmh) < 0.01) {
      this.speedBonusDecayActive = false;
    }

    const speedMps = (this.speedKmh * 1000) / 3600;
    this.distanceM += speedMps * dt;

    const controlProfile = this.getControlProfileForPlatform(this.activeControlPlatform);
    if (this.pointerControlActive && (this.pointerFrameDeltaX !== 0 || this.pointerFrameDeltaY !== 0)) {
      this.desiredTargetX = Phaser.Math.Clamp(
        this.desiredTargetX + this.pointerFrameDeltaX * controlProfile.gainX,
        this.controlMinX,
        this.controlMaxX,
      );
      this.desiredTargetY = Phaser.Math.Clamp(
        this.desiredTargetY + this.pointerFrameDeltaY * controlProfile.gainY,
        this.controlMinY,
        this.controlMaxY,
      );
    }
    this.pointerFrameDeltaX = 0;
    this.pointerFrameDeltaY = 0;

    const targetLerpTx = Phaser.Math.Clamp(controlProfile.targetLerpPerSecX * dt, 0, 1);
    const targetLerpTy = Phaser.Math.Clamp(controlProfile.targetLerpPerSecY * dt, 0, 1);
    this.targetX = this.getSmoothedAxisValue(this.targetX, this.desiredTargetX, targetLerpTx, controlProfile.snapDistancePx);
    this.targetY = this.getSmoothedAxisValue(this.targetY, this.desiredTargetY, targetLerpTy, controlProfile.snapDistancePx);

    if (this.yachtBody) {
      const bodyLerpTx = Phaser.Math.Clamp(controlProfile.bodyLerpPerSecX * dt, 0, 1);
      const bodyLerpTy = Phaser.Math.Clamp(controlProfile.bodyLerpPerSecY * dt, 0, 1);
      const bodyTargetY = this.targetY + this.yMotionOffsetPx;

      const nextBodyX = this.getSmoothedAxisValue(this.yachtBody.x, this.targetX, bodyLerpTx, controlProfile.snapDistancePx);
      const nextBodyY = this.getSmoothedAxisValue(this.yachtBody.y, bodyTargetY, bodyLerpTy, controlProfile.snapDistancePx);
      this.yachtBody.setPosition(nextBodyX, nextBodyY);
    }

    this.processSegmentSchedule();
    this.updateAutoShieldState();
    this.updateShieldRuntime(delta, dt);
    this.applyMineMagnetForces(dt);
    this.updateActiveObjectSpeeds(dt);
    this.updateHazardMotion(dt);
    this.updateMoneyUps(dt);
    this.updateCoins();
    this.updateTimeBonuses();
    this.updateSolidVelocities();
    this.resolveYachtVsSolidEllipses();

    this.assetsValue = Math.max(0, this.assetsValue - dt * TUNING.FUEL_DRAIN_PER_SEC);
    this.updateAutoShieldState();

    this.cleanupFallingObjects();
    this.pruneOldCollisionMaps();

    if (this.water) {
      const extra = Math.max(0, this.speedKmh - 20) * WATER_SCROLL.extraPerKmhAfter20;
      const scrollSpeed = WATER_SCROLL.baseSpeed + this.speedKmh * WATER_SCROLL.perKmh + extra;
      this.water.tilePositionY -= delta * scrollSpeed;
    }

    if (this.yachtBody && this.yachtVisual) {
      this.swayTime += delta / 1000;
      const swayOffset = Math.sin(this.swayTime * YACHT_SWAY.frequencyHz) * YACHT_SWAY.amplitudePx;
      this.yachtVisual.setPosition(this.yachtBody.x, this.yachtBody.y + YACHT_VISUAL_OFFSET.y + swayOffset);
      if (this.yachtHazardCollider) {
        this.yachtHazardCollider.setPosition(
          this.yachtBody.x,
          this.yachtBody.y + (YACHT_HAZARD_HITBOX.offsetY ?? 0),
        );
      }
      this.updateShieldVisualPosition();
    }

    this.updateYachtStageTextureByAssets(this.assetsValue);
    this.updateAssetsBar(this.assetsValue);
    this.updateTopProgressUi();
    this.updateCoinsHud();
    this.updateTimerHud();
    this.updateShieldButtonState();
    this.updateShieldVisualPresentation();
  }

  private createWaterBackground(width: number, height: number) {
    this.water = this.add.tileSprite(0, 0, width, height, "sea-bg").setOrigin(0, 0);
  }

  private createObjectTextures() {
    if (!this.textures.exists("yacht-rect")) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0xf7f7f7, 1);
      graphics.fillRect(0, 0, OBJECT_SIZES.yacht.width, OBJECT_SIZES.yacht.height);
      graphics.lineStyle(2, 0x0b3d4f);
      graphics.strokeRect(0, 0, OBJECT_SIZES.yacht.width, OBJECT_SIZES.yacht.height);
      graphics.generateTexture("yacht-rect", OBJECT_SIZES.yacht.width, OBJECT_SIZES.yacht.height);
      graphics.destroy();
    }
  }

  private createHud(width: number, _height: number) {
    const coinUi = COIN_UI_CONFIG;
    const coinPanel = this.add.graphics();
    coinPanel.setDepth(coinUi.depth);
    coinPanel.fillStyle(coinUi.panelColor, 0.96);
    coinPanel.fillRoundedRect(coinUi.x, coinUi.y, coinUi.width, coinUi.height, coinUi.radius);
    coinPanel.fillStyle(coinUi.titlePanelColor, 1);
    coinPanel.fillRoundedRect(coinUi.x, coinUi.y, coinUi.width, coinUi.titleHeight, coinUi.radius);
    coinPanel.fillRect(coinUi.x, coinUi.y + coinUi.titleHeight - coinUi.radius, coinUi.width, coinUi.radius);

    this.add.text(coinUi.x + coinUi.width / 2, coinUi.y + coinUi.titleHeight / 2, coinUi.title, {
      fontFamily: coinUi.titleFontFamily,
      fontSize: `${coinUi.titleFontSizePx}px`,
      fontStyle: "bold",
      color: coinUi.titleColor,
    })
      .setOrigin(0.5, 0.5)
      .setDepth(coinUi.depth + 1);

    this.add.image(
      coinUi.x + coinUi.iconXOffset,
      coinUi.y + coinUi.titleHeight + (coinUi.height - coinUi.titleHeight) / 2,
      coinUi.iconKey,
    )
      .setDisplaySize(coinUi.iconSize, coinUi.iconSize)
      .setDepth(coinUi.depth + 1);

    this.coinsText = this.add.text(
      coinUi.x + coinUi.valueXOffset,
      coinUi.y + coinUi.titleHeight + (coinUi.height - coinUi.titleHeight) / 2,
      "0",
      {
        fontFamily: coinUi.valueFontFamily,
        fontSize: `${coinUi.valueFontSizePx}px`,
        fontStyle: "bold",
        color: coinUi.valueColor,
      },
    );
    this.coinsText.setOrigin(0, 0.5);
    this.coinsText.setDepth(coinUi.depth + 1);

    const progressCfg = TOP_PROGRESS_BAR_CONFIG;
    const progressX = width * progressCfg.xRatio;
    const progressY = progressCfg.y;

    this.topProgressGraphics = this.add.graphics();
    this.topProgressGraphics.setDepth(progressCfg.depth);
    this.topProgressShipMarker = this.add
      .image(progressX - progressCfg.width / 2, progressY + progressCfg.height / 2 + progressCfg.markerYOffsetPx, progressCfg.markerShipKey)
      .setScale(progressCfg.markerShipScale)
      .setAngle(progressCfg.markerShipRotationDeg)
      .setFlipX(progressCfg.markerShipFlipX)
      .setFlipY(progressCfg.markerShipFlipY)
      .setDepth(progressCfg.depth + 2);
    this.topProgressFlag = this.add
      .image(progressX + progressCfg.width / 2 + progressCfg.flagOffsetX, progressY + progressCfg.height / 2, progressCfg.flagKey)
      .setScale(progressCfg.flagScale)
      .setDepth(progressCfg.depth + 2);

    const timeUi = TIME_UI_CONFIG;
    const timeX = width * timeUi.xRatio - timeUi.width / 2;
    this.timePanelGraphics = this.add.graphics();
    this.timePanelGraphics.setDepth(timeUi.depth);
    this.timePanelGraphics.fillStyle(timeUi.panelColor, 0.96);
    this.timePanelGraphics.fillRoundedRect(timeX, timeUi.y, timeUi.width, timeUi.height, timeUi.radius);
    this.timePanelGraphics.fillStyle(timeUi.titlePanelColor, 1);
    this.timePanelGraphics.fillRoundedRect(timeX, timeUi.y, timeUi.width, timeUi.titleHeight, timeUi.radius);
    this.timePanelGraphics.fillRect(timeX, timeUi.y + timeUi.titleHeight - timeUi.radius, timeUi.width, timeUi.radius);

    this.add.text(timeX + timeUi.width / 2, timeUi.y + timeUi.titleHeight / 2, timeUi.title, {
      fontFamily: timeUi.titleFontFamily,
      fontSize: `${timeUi.titleFontSizePx}px`,
      fontStyle: "bold",
      color: timeUi.titleColor,
    })
      .setOrigin(0.5, 0.5)
      .setDepth(timeUi.depth + 1);

    this.timeText = this.add.text(
      timeX + timeUi.width / 2,
      timeUi.y + timeUi.titleHeight + (timeUi.height - timeUi.titleHeight) / 2,
      this.formatTimeMMSS(this.remainingTimeMs),
      {
        fontFamily: timeUi.valueFontFamily,
        fontSize: `${timeUi.valueFontSizePx}px`,
        color: timeUi.valueColor,
        fontStyle: "bold",
      },
    );
    this.timeText.setOrigin(0.5, 0.5);
    this.timeText.setDepth(timeUi.depth + 1);

    this.createRedHitOverlay(width, this.scale.height);
    this.updateCoinsHud();
    this.updateTopProgressUi();
  }

  private createShieldUi(width: number, height: number) {
    this.destroyShieldUi();
    if (!ASSET_SHIELD_CONFIG.enable) {
      return;
    }

    const buttonCfg = ASSET_SHIELD_CONFIG.button;
    if (!buttonCfg.hidden) {
      const centerX = buttonCfg.marginLeftPx + buttonCfg.radiusPx;
      const centerY = height - buttonCfg.marginBottomPx - buttonCfg.radiusPx;

      this.shieldButtonCircle = this.add.circle(centerX, centerY, buttonCfg.radiusPx, buttonCfg.disabled.fillColor, 1);
      this.shieldButtonCircle.setStrokeStyle(buttonCfg.strokeWidthPx, buttonCfg.strokeColor, 1);
      this.shieldButtonCircle.setScrollFactor(0);
      this.shieldButtonCircle.setDepth(buttonCfg.depth);
      this.shieldButtonCircle.setScale(buttonCfg.disabled.scale);

      this.shieldButtonLabel = this.add.text(centerX, centerY, buttonCfg.disabled.label, {
        fontFamily: buttonCfg.textFontFamily,
        fontSize: `${buttonCfg.textFontSizePx}px`,
        color: buttonCfg.disabled.textColor,
        fontStyle: "bold",
        align: "center",
      });
      this.shieldButtonLabel.setOrigin(0.5, 0.5);
      this.shieldButtonLabel.setScrollFactor(0);
      this.shieldButtonLabel.setDepth(buttonCfg.depth + 1);
    }

    this.shieldVisual = this.add.graphics();
    this.shieldVisual.setDepth(ASSET_SHIELD_CONFIG.visual.depth);
    this.shieldVisual.setVisible(false);
    this.shieldVisual.setAlpha(0);
    this.shieldVisual.setScale(ASSET_SHIELD_CONFIG.visual.appear.startScale);
    this.redrawShieldVisual();
    this.updateShieldVisualPosition();
    this.updateShieldButtonState(true);

    this.scale.off("resize", this.handleShieldResize, this);
    if (!buttonCfg.hidden) {
      this.scale.on("resize", this.handleShieldResize, this);
      this.handleShieldResize({ width, height });
    }
  }

  private redrawShieldVisual() {
    if (!this.shieldVisual) {
      return;
    }

    const visualCfg = ASSET_SHIELD_CONFIG.visual;
    const radius = visualCfg.radiusPx;
    const thickness = Math.max(1, visualCfg.thicknessPx);
    const steps = Math.max(4, visualCfg.gradientSteps);
    const outerColor = Phaser.Display.Color.ValueToColor(visualCfg.outerColor);
    const innerColor = Phaser.Display.Color.ValueToColor(visualCfg.innerColor);

    this.shieldVisual.clear();
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(outerColor, innerColor, 100, Math.round(t * 100));
      const color = Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
      const alpha = Phaser.Math.Linear(visualCfg.outerAlpha, visualCfg.innerAlpha, t);
      const ringRadius = radius - t * thickness;
      this.shieldVisual.lineStyle(Math.max(1, thickness / steps), color, alpha);
      this.shieldVisual.strokeCircle(0, 0, Math.max(1, ringRadius));
    }
  }

  private handleShieldResize(gameSize: { width: number; height: number }) {
    if (!ASSET_SHIELD_CONFIG.enable || !this.shieldButtonCircle || !this.shieldButtonLabel) {
      return;
    }
    const buttonCfg = ASSET_SHIELD_CONFIG.button;
    const centerX = buttonCfg.marginLeftPx + buttonCfg.radiusPx;
    const centerY = gameSize.height - buttonCfg.marginBottomPx - buttonCfg.radiusPx;
    this.shieldButtonCircle.setPosition(centerX, centerY);
    this.shieldButtonLabel.setPosition(centerX, centerY);
  }

  private destroyShieldUi() {
    this.scale.off("resize", this.handleShieldResize, this);
    this.shieldTapCandidate = undefined;
    this.shieldButtonTween?.stop();
    this.shieldButtonTween = undefined;
    this.shieldVisualTween?.stop();
    this.shieldVisualTween = undefined;
    this.stopShieldShipBlink();
    this.shieldButtonCircle?.destroy();
    this.shieldButtonLabel?.destroy();
    this.shieldVisual?.destroy();
    this.shieldButtonCircle = undefined;
    this.shieldButtonLabel = undefined;
    this.shieldVisual = undefined;
    this.shieldVisualActivation = 0;
    this.shieldVisualScaleFactor = 1;
    this.shieldButtonState = "disabled";
  }

  private updateShieldButtonState(force = false) {
    if (!ASSET_SHIELD_CONFIG.enable) {
      return;
    }

    let nextState: ShieldButtonState = "disabled";
    if (this.shieldActive) {
      nextState = "active";
    } else if (this.assetsValue >= ASSET_SHIELD_CONFIG.activation.fuelReadyThreshold) {
      nextState = "ready";
    }

    if (!force && this.shieldButtonState === nextState) {
      return;
    }
    this.applyShieldButtonState(nextState, !force);
  }

  private applyShieldButtonState(nextState: ShieldButtonState, animate: boolean) {
    this.shieldButtonState = nextState;
    if (!this.shieldButtonCircle || !this.shieldButtonLabel) {
      return;
    }

    const buttonCfg = ASSET_SHIELD_CONFIG.button;
    const style = buttonCfg[nextState];
    const targetScale = style.scale;
    this.shieldButtonLabel.setText(style.label);

    this.shieldButtonTween?.stop();
    this.shieldButtonTween = undefined;

    if (!animate) {
      this.shieldButtonCircle.setFillStyle(style.fillColor, 1);
      this.shieldButtonCircle.setScale(targetScale);
      this.shieldButtonLabel.setColor(style.textColor);
      this.shieldButtonCircle.setData("shieldFillColor", style.fillColor);
      this.shieldButtonLabel.setData("shieldTextColorHex", style.textColor);
      return;
    }

    const currentFillColor = (this.shieldButtonCircle.getData("shieldFillColor") as number | undefined) ?? style.fillColor;
    const currentTextHex = (this.shieldButtonLabel.getData("shieldTextColorHex") as string | undefined) ?? style.textColor;
    const fromFillColor = Phaser.Display.Color.ValueToColor(currentFillColor);
    const toFillColor = Phaser.Display.Color.ValueToColor(style.fillColor);
    const fromTextColor = Phaser.Display.Color.HexStringToColor(currentTextHex);
    const toTextColor = Phaser.Display.Color.HexStringToColor(style.textColor);
    const fromScale = this.shieldButtonCircle.scaleX;
    const state = { t: 0 };

    this.shieldButtonTween = this.tweens.add({
      targets: state,
      t: 1,
      duration: buttonCfg.stateTransitionDurationMs,
      ease: buttonCfg.stateTransitionEase,
      onUpdate: () => {
        if (!this.shieldButtonCircle || !this.shieldButtonLabel) {
          return;
        }
        const mix = Math.round(state.t * 100);
        const mixedFill = Phaser.Display.Color.Interpolate.ColorWithColor(fromFillColor, toFillColor, 100, mix);
        this.shieldButtonCircle.setFillStyle(Phaser.Display.Color.GetColor(mixedFill.r, mixedFill.g, mixedFill.b), 1);
        const mixedText = Phaser.Display.Color.Interpolate.ColorWithColor(fromTextColor, toTextColor, 100, mix);
        this.shieldButtonLabel.setColor(Phaser.Display.Color.RGBToString(mixedText.r, mixedText.g, mixedText.b, 255, "#"));
        this.shieldButtonCircle.setScale(Phaser.Math.Linear(fromScale, targetScale, state.t));
      },
      onComplete: () => {
        this.shieldButtonCircle?.setData("shieldFillColor", style.fillColor);
        this.shieldButtonLabel?.setData("shieldTextColorHex", style.textColor);
        this.shieldButtonTween = undefined;
      },
    });
  }

  private pulseShieldButtonRejectedTap() {
    if (!this.shieldButtonCircle) {
      return;
    }
    const buttonCfg = ASSET_SHIELD_CONFIG.button;
    const baseScale = this.shieldButtonCircle.scaleX;
    this.tweens.add({
      targets: this.shieldButtonCircle,
      scaleX: baseScale * buttonCfg.tapRejectedPulseScale,
      scaleY: baseScale * buttonCfg.tapRejectedPulseScale,
      duration: buttonCfg.tapRejectedPulseDurationMs,
      ease: "Sine.easeOut",
      yoyo: true,
      onComplete: () => {
        if (this.shieldButtonCircle) {
          this.shieldButtonCircle.setScale(baseScale);
        }
      },
    });
  }

  private updateShieldVisualPosition() {
    if (!this.shieldVisual || !this.yachtVisual) {
      return;
    }
    this.shieldVisual.setPosition(this.yachtVisual.x, this.yachtVisual.y + ASSET_SHIELD_CONFIG.visual.yOffsetPx);
  }

  private updateShieldVisualPresentation() {
    if (!this.shieldVisual) {
      return;
    }

    const visualCfg = ASSET_SHIELD_CONFIG.visual;
    const fadeCfg = ASSET_SHIELD_CONFIG.fadeOut;
    let fadeFactor = 1;

    if (
      this.shieldActive &&
      ASSET_SHIELD_CONFIG.runtime.timerEnabled &&
      ASSET_SHIELD_CONFIG.runtime.durationMs > 0 &&
      fadeCfg.enabled
    ) {
      const progress = Phaser.Math.Clamp(this.shieldRemainingMs / ASSET_SHIELD_CONFIG.runtime.durationMs, 0, 1);
      const alphaWithProgress = visualCfg.alpha * progress;
      if (fadeCfg.hardDropToZeroBelowCutoff && alphaWithProgress <= fadeCfg.cutoffAlpha) {
        fadeFactor = 0;
      } else if (visualCfg.alpha > 0) {
        fadeFactor = Phaser.Math.Clamp(alphaWithProgress / visualCfg.alpha, 0, 1);
      }
    }

    const alpha = visualCfg.alpha * this.shieldVisualActivation * fadeFactor;
    this.shieldVisual.setAlpha(alpha);
    this.shieldVisual.setScale(this.shieldVisualScaleFactor);
    this.shieldVisual.setVisible(alpha > 0.001 || this.shieldActive);
  }

  private playShieldVisualEnter() {
    if (!this.shieldVisual) {
      return;
    }

    this.shieldVisualTween?.stop();
    this.shieldVisual.setVisible(true);
    this.shieldVisualActivation = 0;
    this.shieldVisualScaleFactor = ASSET_SHIELD_CONFIG.visual.appear.startScale;
    const easeFn = this.createShieldBezierEase();
    this.shieldVisualTween = this.tweens.add({
      targets: this,
      shieldVisualActivation: 1,
      shieldVisualScaleFactor: ASSET_SHIELD_CONFIG.visual.appear.endScale,
      duration: ASSET_SHIELD_CONFIG.visual.appear.durationMs,
      ease: easeFn,
      onComplete: () => {
        this.shieldVisualTween = undefined;
      },
    });
  }

  private playShieldVisualExit() {
    if (!this.shieldVisual) {
      return;
    }

    this.shieldVisualTween?.stop();
    this.shieldVisualTween = this.tweens.add({
      targets: this,
      shieldVisualActivation: 0,
      shieldVisualScaleFactor: ASSET_SHIELD_CONFIG.visual.disappear.endScale,
      duration: ASSET_SHIELD_CONFIG.visual.disappear.durationMs,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.shieldVisualTween = undefined;
        if (this.shieldVisual) {
          this.shieldVisual.setVisible(false);
        }
      },
    });
  }

  private createYacht(width: number, height: number) {
    this.playAreaLeft = Math.round(width * PLAY_AREA.leftPaddingRatio);
    this.playAreaRight = Math.round(width * PLAY_AREA.rightPaddingRatio);

    this.updateControlBoundsForPlatform(this.activeControlPlatform);

    const startX = Math.round(width * 0.5);
    const startY = Math.round(height * 0.8);

    this.yachtBody = this.physics.add.sprite(startX, startY, "yacht-rect");
    this.yachtBody.body.setAllowGravity(false);
    this.yachtBody.setImmovable(true);
    this.yachtBody.setVisible(false);

    this.yachtHazardCollider = this.physics.add.sprite(startX, startY, "yacht-rect");
    this.yachtHazardCollider.body.setAllowGravity(false);
    this.yachtHazardCollider.setImmovable(true);
    this.yachtHazardCollider.setVisible(false);

    this.yachtVisual = this.add.image(startX, startY, "ship-5");
    this.yachtVisual.setDepth(5);
    this.applyYachtVisualSizing();

    this.targetX = Phaser.Math.Clamp(startX, this.controlMinX, this.controlMaxX);
    this.targetY = Phaser.Math.Clamp(startY, this.controlMinY, this.controlMaxY);
    this.desiredTargetX = this.targetX;
    this.desiredTargetY = this.targetY;

    this.createAssetsBar();
    this.updateYachtStageTextureByAssets(this.assetsValue);
    this.updateAssetsBar(this.assetsValue);
  }

  private applyYachtVisualSizing() {
    if (!this.yachtVisual) {
      return;
    }

    const frameHeight = this.yachtVisual.frame?.realHeight ?? this.yachtVisual.height;
    if (frameHeight <= 0) {
      return;
    }

    const scale = YACHT_VISUAL_SIZE.targetHeightPx / frameHeight;
    this.yachtVisual.setScale(scale);
    this.updateYachtBodyHitboxFromVisual();
  }

  private updateYachtBodyHitboxFromVisual() {
    if (!this.yachtBody || !this.yachtVisual || !this.yachtHazardCollider) {
      return;
    }

    const body = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    const hazardBody = this.yachtHazardCollider.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body || !hazardBody) {
      return;
    }

    const bodyWidth = Math.max(
      YACHT_VISUAL_SIZE.minHitboxWidthPx,
      Math.round(this.yachtVisual.displayWidth * YACHT_VISUAL_SIZE.hitboxWidthRatioToVisual),
    );
    const bodyHeight = Math.max(
      YACHT_VISUAL_SIZE.minHitboxHeightPx,
      Math.round(this.yachtVisual.displayHeight * YACHT_VISUAL_SIZE.hitboxHeightRatioToVisual),
    );

    body.setSize(bodyWidth, bodyHeight, true);

    const hazardWidth = Math.max(
      YACHT_HAZARD_HITBOX.minWidthPx,
      Math.round(this.yachtVisual.displayWidth * YACHT_HAZARD_HITBOX.widthRatioToVisual),
    );
    const hazardHeight = Math.max(
      YACHT_HAZARD_HITBOX.minHeightPx,
      Math.round(this.yachtVisual.displayHeight * YACHT_HAZARD_HITBOX.heightRatioToVisual),
    );
    hazardBody.setSize(hazardWidth, hazardHeight, true);
  }

  private createGroups() {
    this.hazards = this.physics.add.group({ allowGravity: false });
    this.moneyUps = this.physics.add.group({ allowGravity: false });
    this.coins = this.physics.add.group({ allowGravity: false });
    this.timeBonuses = this.physics.add.group({ allowGravity: false });
    this.solids = this.physics.add.group({ allowGravity: false, immovable: true });
  }

  private setupCollisions() {
    if (!this.yachtBody || !this.yachtHazardCollider) {
      return;
    }

    this.physics.add.overlap(this.yachtHazardCollider, this.hazards, (_yacht, hazardObj) => {
      const sprite = hazardObj as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.handleHazardContact(sprite);
    });

    this.physics.add.overlap(this.yachtHazardCollider, this.moneyUps, (_yacht, pickupObj) => {
      const sprite = pickupObj as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.collectMoneyUp(sprite);
    });

    this.physics.add.overlap(this.yachtHazardCollider, this.coins, (_yacht, coinObj) => {
      const sprite = coinObj as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.collectCoin(sprite);
    });

    this.physics.add.overlap(this.yachtHazardCollider, this.timeBonuses, (_yacht, bonusObj) => {
      const sprite = bonusObj as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.collectAirBonus(sprite);
    });

    this.physics.add.collider(
      this.yachtBody,
      this.solids,
      (_yacht, solidObj) => {
        const sprite = solidObj as Phaser.Physics.Arcade.Sprite;
        this.handleSolidColliderContact(sprite);
      },
      (_yacht, solidObj) => !this.isGameOver && this.canYachtBeBlockedBySolid(solidObj as Phaser.Physics.Arcade.Sprite),
      this,
    );

    this.physics.add.collider(
      this.hazards,
      this.hazards,
      (objA, objB) => this.handleBuoyCollision(objA as Phaser.Physics.Arcade.Sprite, objB as Phaser.Physics.Arcade.Sprite),
      (objA, objB) =>
        BUOY_COLLISION_LAYER.pairs.hazardToHazard &&
        this.canUseBuoyCollisionPush(objA as Phaser.Physics.Arcade.Sprite) &&
        this.canUseBuoyCollisionPush(objB as Phaser.Physics.Arcade.Sprite),
    );

    this.physics.add.collider(
      this.hazards,
      this.moneyUps,
      (objA, objB) => this.handleBuoyCollision(objA as Phaser.Physics.Arcade.Sprite, objB as Phaser.Physics.Arcade.Sprite),
      (objA, objB) =>
        BUOY_COLLISION_LAYER.pairs.hazardToMoneyUp &&
        this.canUseBuoyCollisionPush(objA as Phaser.Physics.Arcade.Sprite) &&
        this.canUseBuoyCollisionPush(objB as Phaser.Physics.Arcade.Sprite),
    );

    this.physics.add.collider(
      this.moneyUps,
      this.moneyUps,
      (objA, objB) => this.handleBuoyCollision(objA as Phaser.Physics.Arcade.Sprite, objB as Phaser.Physics.Arcade.Sprite),
      (objA, objB) =>
        BUOY_COLLISION_LAYER.pairs.moneyUpToMoneyUp &&
        this.canUseBuoyCollisionPush(objA as Phaser.Physics.Arcade.Sprite) &&
        this.canUseBuoyCollisionPush(objB as Phaser.Physics.Arcade.Sprite),
    );

    this.physics.add.collider(
      this.hazards,
      this.solids,
      undefined,
      (objA, solidObj) =>
        BUOY_COLLISION_LAYER.pairs.hazardToSolids &&
        this.canBlockAgainstSolids(objA as Phaser.Physics.Arcade.Sprite, solidObj as Phaser.Physics.Arcade.Sprite),
    );

    this.physics.add.collider(
      this.moneyUps,
      this.solids,
      undefined,
      (objA, solidObj) =>
        BUOY_COLLISION_LAYER.pairs.moneyUpToSolids &&
        this.canBlockAgainstSolids(objA as Phaser.Physics.Arcade.Sprite, solidObj as Phaser.Physics.Arcade.Sprite),
    );
  }

  private buildRunSegmentSchedule() {
    this.scheduledObjects = [];
    this.coinsScheduledTotal = 0;

    for (const pool of LEVEL_SEGMENT_POOLS) {
      let cursor = pool.startMeter;
      while (cursor < pool.endMeter) {
        const template = this.pickTemplateByWeight(pool.templates);
        if (!template) {
          break;
        }
        const remaining = pool.endMeter - cursor;
        const usedLength = Math.max(1, Math.min(template.lengthMeters, remaining));
        this.appendTemplateObjects(template, cursor, usedLength, pool.endMeter);
        this.appendCoinForSegment(cursor, usedLength, pool.endMeter, template.id);
        cursor += usedLength;
      }
    }

    this.appendSpeedBonuses();

    this.appendTemplateObjects(
      FINAL_SEGMENT_1200_1250,
      1200,
      FINAL_SEGMENT_1200_1250.lengthMeters,
      1250,
    );

    this.appendMissingCoinsInFinalWindow();

    this.scheduledObjects.sort((a, b) => a.spawnMeter - b.spawnMeter);
    this.scheduledObjectCursor = 0;
  }

  private pickTemplateByWeight(templates: SegmentTemplate[]) {
    if (templates.length === 0) {
      return null;
    }

    const totalWeight = templates.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
    if (totalWeight <= 0) {
      return Phaser.Utils.Array.GetRandom(templates);
    }

    let random = Phaser.Math.FloatBetween(0, totalWeight);
    for (const template of templates) {
      random -= Math.max(0, template.weight);
      if (random <= 0) {
        return template;
      }
    }
    return templates[templates.length - 1];
  }

  private appendTemplateObjects(template: SegmentTemplate, segmentStartMeter: number, usedLength: number, segmentEndMeter: number) {
    for (const item of template.objects) {
      if (item.meterOffset < 0 || item.meterOffset > usedLength) {
        continue;
      }
      const spawnMeter = segmentStartMeter + item.meterOffset;
      if (spawnMeter > segmentEndMeter) {
        continue;
      }
      this.scheduledObjects.push({
        ...item,
        scheduleId: `${template.id}@${spawnMeter.toFixed(2)}@${this.scheduledObjects.length}`,
        spawnMeter,
      });
      if (item.type === "coin") {
        this.coinsScheduledTotal += 1;
      }
    }
  }

  private appendCoinForSegment(segmentStartMeter: number, usedLength: number, segmentEndMeter: number, segmentId: string) {
    const coinRules = SEGMENT_PICKUP_RULES.coin;
    if (!coinRules.oneCoinPerSegment) {
      return;
    }
    if (segmentStartMeter >= coinRules.finalFillStartMeters) {
      return;
    }
    if (this.coinsScheduledTotal >= coinRules.totalCount) {
      return;
    }

    const minOffset = Math.min(usedLength, Math.max(0, coinRules.segmentOffsetMinMeters));
    const maxOffset = Math.min(usedLength, Math.max(minOffset, coinRules.segmentOffsetMaxMeters));
    const offset = Phaser.Math.FloatBetween(minOffset, maxOffset);
    const spawnMeter = Math.min(segmentEndMeter, segmentStartMeter + offset);
    const xRatio = Phaser.Math.FloatBetween(0.22, 0.78);

    this.scheduledObjects.push({
      type: "coin",
      meterOffset: offset,
      xRatio,
      scheduleId: `coin-segment-${segmentId}@${spawnMeter.toFixed(2)}@${this.scheduledObjects.length}`,
      spawnMeter,
    });
    this.coinsScheduledTotal += 1;
  }

  private appendSpeedBonuses() {
    const speedRules = SEGMENT_PICKUP_RULES.speedBonus;
    for (const meter of speedRules.boostMeters) {
      this.scheduledObjects.push({
        type: "speedBonus",
        meterOffset: 0,
        xRatio: Phaser.Math.FloatBetween(speedRules.xRatioMin, speedRules.xRatioMax),
        scheduleId: `speedBonus@${meter}@${this.scheduledObjects.length}`,
        spawnMeter: meter,
      });
    }
  }

  private appendMissingCoinsInFinalWindow() {
    const coinRules = SEGMENT_PICKUP_RULES.coin;
    const missing = Math.max(0, coinRules.totalCount - this.coinsScheduledTotal);
    if (missing === 0) {
      return;
    }

    for (let i = 0; i < missing; i += 1) {
      const spawnMeter = Phaser.Math.FloatBetween(coinRules.finalFillStartMeters + 3, coinRules.finalFillEndMeters - 3);
      const xRatio = Phaser.Math.FloatBetween(coinRules.finalFillXRatioMin, coinRules.finalFillXRatioMax);
      this.scheduledObjects.push({
        type: "coin",
        meterOffset: 0,
        xRatio,
        scheduleId: `coin-final-fill-${i}@${spawnMeter.toFixed(2)}@${this.scheduledObjects.length}`,
        spawnMeter,
      });
      this.coinsScheduledTotal += 1;
    }
  }

  private processSegmentSchedule() {
    while (this.scheduledObjectCursor < this.scheduledObjects.length) {
      const scheduled = this.scheduledObjects[this.scheduledObjectCursor];
      const spawnThresholdMeter = this.getSpawnThresholdForScheduledType(scheduled.type);
      if (scheduled.spawnMeter > spawnThresholdMeter) {
        break;
      }
      this.spawnScheduledObject(scheduled);
      this.scheduledObjectCursor += 1;
    }
  }

  private getSpawnThresholdForScheduledType(type: SegmentObjectType) {
    if (type === "harbor" || type === "harborGate") {
      return this.distanceM;
    }
    return this.distanceM + SEGMENT_SPAWN.scheduleLookaheadMeters;
  }

  private spawnScheduledObject(item: ScheduledSegmentObject) {
    const x = this.resolveSpawnX(item);
    switch (item.type) {
      case "mine":
        this.spawnMine(x);
        break;
      case "pirate":
        this.spawnPirate(x);
        break;
      case "moneyDown":
        this.spawnMoneyDown(x);
        break;
      case "dynamicBuoy":
        this.spawnDynamicBuoy(x);
        break;
      case "whirlpool":
        this.spawnWhirlpool(x);
        break;
      case "rock1":
      case "rock2":
      case "rock3":
        this.spawnRock(item.type, x);
        break;
      case "moneyUp":
        this.spawnMoneyUp(x);
        break;
      case "coin":
        this.spawnCoin(x);
        break;
      case "speedBonus":
        this.spawnSpeedBonus(x);
        break;
      case "timeBonus":
        this.spawnTimeBonus(x);
        break;
      case "island1":
      case "island2":
      case "harbor":
        this.spawnLandmark(item.type, x);
        break;
      case "harborGate":
        this.spawnHarborGate(x);
        break;
      default:
        break;
    }
  }

  private resolveSpawnX(item: SegmentObjectDef) {
    const range = this.playAreaRight - this.playAreaLeft;
    const ratio = item.xRatio ?? 0.5;
    const baseX = this.playAreaLeft + range * Phaser.Math.Clamp(ratio, 0, 1);
    const x = baseX + (item.xOffsetPx ?? 0);

    if (item.type === "rock1" || item.type === "rock2" || item.type === "rock3") {
      const halfRange = ROCK_CONFIG.common.partialSpawnMaxOffsetPx;
      return Phaser.Math.Clamp(x, this.playAreaLeft - halfRange, this.playAreaRight + halfRange);
    }

    return Phaser.Math.Clamp(x, this.playAreaLeft + 8, this.playAreaRight - 8);
  }

  private spawnMine(x: number) {
    const sprite = this.hazards.get(x, SEGMENT_SPAWN.objectSpawnY, MINE_CONFIG.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareHazardSprite(sprite, "mine", MINE_CONFIG.width, MINE_CONFIG.height, MINE_CONFIG.depth, MINE_CONFIG.hitbox);
    sprite.setData("speedMultiplier", MINE_CONFIG.speedYMultiplier);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", MINE_CONFIG.driftAmplitudePx);
    sprite.setData("driftFrequency", MINE_CONFIG.driftFrequencyHz);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(MINE_CONFIG.driftPhaseMin, MINE_CONFIG.driftPhaseMax));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayFrequency", MINE_CONFIG.swayFrequencyHz);
    sprite.setData("swayAmplitudeDeg", MINE_CONFIG.swayAmplitudeDeg);
    sprite.setData("collisionCooldownMs", MINE_CONFIG.collisionCooldownMs);
    sprite.setData("applyImpactAnimation", MINE_CONFIG.applyImpactAnimation);
    sprite.setData("destroyOnContact", MINE_CONFIG.applyImpactAnimation);
    sprite.setData("blocking", true);
    sprite.setData("mineMagnetLastTickAt", Number.NEGATIVE_INFINITY);
  }

  private spawnPirate(x: number) {
    const sprite = this.hazards.get(x, SEGMENT_SPAWN.objectSpawnY, PIRATE_CONFIG.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareHazardSprite(sprite, "pirate", PIRATE_CONFIG.width, PIRATE_CONFIG.height, PIRATE_CONFIG.depth, PIRATE_CONFIG.hitbox);
    sprite.setFlipY(PIRATE_CONFIG.flipY);
    sprite.setData("speedMultiplier", PIRATE_CONFIG.speedYMultiplier);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", PIRATE_CONFIG.driftAmplitudePx);
    sprite.setData("driftFrequency", PIRATE_CONFIG.driftFrequencyHz);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(PIRATE_CONFIG.driftPhaseMin, PIRATE_CONFIG.driftPhaseMax));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayFrequency", PIRATE_CONFIG.swayFrequencyHz);
    sprite.setData("swayAmplitudeDeg", PIRATE_CONFIG.swayAmplitudeDeg);
    sprite.setData("collisionCooldownMs", PIRATE_CONFIG.collisionCooldownMs);
    sprite.setData("applyImpactAnimation", PIRATE_CONFIG.applyImpactAnimation);
    sprite.setData("destroyOnContact", false);
    sprite.setData("blocking", true);
  }

  private spawnMoneyDown(x: number) {
    const sprite = this.hazards.get(x, SEGMENT_SPAWN.objectSpawnY, MONEY_DOWN_CONFIG.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareHazardSprite(
      sprite,
      "moneyDown",
      MONEY_DOWN_CONFIG.width,
      MONEY_DOWN_CONFIG.height,
      MONEY_DOWN_CONFIG.depth,
      MONEY_DOWN_CONFIG.hitbox,
    );
    sprite.setData("speedMultiplier", MONEY_DOWN_CONFIG.speedYMultiplier);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", MONEY_DOWN_CONFIG.driftAmplitudePx);
    sprite.setData("driftFrequency", MONEY_DOWN_CONFIG.driftFrequencyHz);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(MONEY_DOWN_CONFIG.driftPhaseMin, MONEY_DOWN_CONFIG.driftPhaseMax));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayFrequency", MONEY_DOWN_CONFIG.swayFrequencyHz);
    sprite.setData("swayAmplitudeDeg", MONEY_DOWN_CONFIG.swayAmplitudeDeg);
    sprite.setData("collisionCooldownMs", MONEY_DOWN_CONFIG.collisionCooldownMs);
    sprite.setData("applyImpactAnimation", MONEY_DOWN_CONFIG.applyImpactAnimation);
    sprite.setData("destroyOnContact", MONEY_DOWN_CONFIG.destroyOnContact);
    sprite.setData("blocking", true);
  }

  private spawnDynamicBuoy(x: number) {
    const sprite = this.hazards.get(x, SEGMENT_SPAWN.objectSpawnY, DYNAMIC_BUOY_STATES.up.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.stopDynamicBuoyStateTimer(sprite);
    this.prepareHazardSprite(
      sprite,
      "dynamicBuoy",
      DYNAMIC_BUOY_CONFIG.width,
      DYNAMIC_BUOY_CONFIG.height,
      DYNAMIC_BUOY_CONFIG.depth,
      DYNAMIC_BUOY_CONFIG.hitbox,
    );
    sprite.setData("speedMultiplier", DYNAMIC_BUOY_CONFIG.speedYMultiplier);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", DYNAMIC_BUOY_CONFIG.driftAmplitudePx);
    sprite.setData("driftFrequency", DYNAMIC_BUOY_CONFIG.driftFrequencyHz);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(DYNAMIC_BUOY_CONFIG.driftPhaseMin, DYNAMIC_BUOY_CONFIG.driftPhaseMax));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayFrequency", DYNAMIC_BUOY_CONFIG.swayFrequencyHz);
    sprite.setData("swayAmplitudeDeg", DYNAMIC_BUOY_CONFIG.swayAmplitudeDeg);
    sprite.setData("collisionCooldownMs", DYNAMIC_BUOY_CONFIG.collisionCooldownMs);
    sprite.setData("applyImpactAnimation", DYNAMIC_BUOY_CONFIG.applyImpactAnimation);
    sprite.setData("destroyOnContact", DYNAMIC_BUOY_CONFIG.destroyOnContact);
    sprite.setData("blocking", true);

    const initialState = Phaser.Math.Between(0, 1) === 0 ? "up" : "down";
    sprite.setData("dynamicState", initialState);
    sprite.setData("dynamicBlinkSourceState", initialState);
    sprite.setData("dynamicBlinkTargetState", initialState === "up" ? "down" : "up");
    this.applyDynamicBuoyVisualState(sprite, initialState);
    this.scheduleDynamicBuoyDwell(sprite, initialState);
  }

  private spawnWhirlpool(x: number) {
    const sprite = this.hazards.get(x, SEGMENT_SPAWN.objectSpawnY, WHIRLPOOL_CONFIG.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareHazardSprite(
      sprite,
      "whirlpool",
      WHIRLPOOL_CONFIG.width,
      WHIRLPOOL_CONFIG.height,
      WHIRLPOOL_CONFIG.depth,
      WHIRLPOOL_CONFIG.hitbox,
    );
    sprite.setData("speedMultiplier", WHIRLPOOL_CONFIG.speedYMultiplier);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", WHIRLPOOL_CONFIG.driftAmplitudePx);
    sprite.setData("driftFrequency", WHIRLPOOL_CONFIG.driftFrequencyHz);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(WHIRLPOOL_CONFIG.driftPhaseMin, WHIRLPOOL_CONFIG.driftPhaseMax));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayFrequency", WHIRLPOOL_CONFIG.swayFrequencyHz);
    sprite.setData("swayAmplitudeDeg", WHIRLPOOL_CONFIG.swayAmplitudeDeg);
    sprite.setData("collisionCooldownMs", WHIRLPOOL_CONFIG.collisionCooldownMs);
    sprite.setData("applyImpactAnimation", WHIRLPOOL_CONFIG.applyImpactAnimation);
    sprite.setData("destroyOnContact", WHIRLPOOL_CONFIG.destroyOnContact);
    sprite.setData("blocking", WHIRLPOOL_CONFIG.blocking);
    sprite.setData("whirlpoolPulsePhase", Phaser.Math.FloatBetween(WHIRLPOOL_CONFIG.pulse.phaseMin, WHIRLPOOL_CONFIG.pulse.phaseMax));
  }

  private prepareHazardSprite(
    sprite: Phaser.Physics.Arcade.Sprite,
    hazardType: HazardType,
    width: number,
    height: number,
    depth: number,
    hitbox: EllipseHitbox,
  ) {
    sprite.setActive(true).setVisible(true);
    sprite.setAlpha(1);
    sprite.setScale(1);
    sprite.setFlip(false, false);
    sprite.setRotation(0);
    sprite.setDepth(depth);
    sprite.setDisplaySize(width, height);
    sprite.setData("baseScaleX", sprite.scaleX);
    sprite.setData("baseScaleY", sprite.scaleY);

    let body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      this.physics.world.enable(sprite);
      body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    }
    if (!body) {
      return;
    }

    body.setAllowGravity(false);

    this.applyEllipseBody(sprite, hitbox);

    const speedY = this.getBaseFallSpeedByKmh(this.speedKmh);
    sprite.setVelocity(0, speedY);
    sprite.setData("hazardType", hazardType);
    sprite.setData("collecting", false);
    sprite.setData("pushX", 0);
    sprite.setData("pushVx", 0);
    sprite.setData("pushVy", 0);
    sprite.setData("lastCollisionAt", 0);
    this.ensureObjectCollisionId(sprite);
  }

  private spawnMoneyUp(x: number) {
    const sprite = this.moneyUps.get(x, SEGMENT_SPAWN.objectSpawnY, MONEY_UP_TEXTURE_KEY) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    sprite.setActive(true).setVisible(true);
    sprite.setAlpha(1);
    sprite.setScale(1);
    sprite.setRotation(0);
    sprite.setDepth(MONEY_UP_DEPTH);
    sprite.setDisplaySize(OBJECT_SIZES.moneyUp.width, OBJECT_SIZES.moneyUp.height);

    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }
    body.setAllowGravity(false);
    this.applyEllipseBody(sprite, MONEY_UP_HITBOX);

    sprite.setVelocity(0, this.getBaseFallSpeedByKmh(this.speedKmh) * MONEY_UP_SPEED_MULTIPLIER);
    sprite.setData("speedMultiplier", MONEY_UP_SPEED_MULTIPLIER);
    sprite.setData("collecting", false);
    sprite.setData("driftBaseX", x);
    sprite.setData("driftAmplitude", MONEY_UP_DRIFT_AMPLITUDE_PX);
    sprite.setData("driftFrequency", MONEY_UP_DRIFT_FREQUENCY_HZ);
    sprite.setData("driftPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("swayPhase", Phaser.Math.FloatBetween(0, Math.PI * 2));
    sprite.setData("pushX", 0);
    sprite.setData("pushVx", 0);
    sprite.setData("pushVy", 0);
    sprite.setData("lastCollisionAt", 0);
    sprite.setData("blocking", true);
    this.ensureObjectCollisionId(sprite);
  }

  private spawnTimeBonus(x: number) {
    this.spawnAirBonus("time", TIME_BONUS, x);
  }

  private spawnSpeedBonus(x: number) {
    this.spawnAirBonus("speed", SPEED_BONUS_CONFIG, x);
  }

  private spawnAirBonus(type: AirBonusType, config: typeof TIME_BONUS | typeof SPEED_BONUS_CONFIG, x: number) {
    const bonus = this.timeBonuses.get(x, SEGMENT_SPAWN.objectSpawnY + config.spawnYOffset, config.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!bonus) {
      return;
    }

    this.destroyTimeBonusShadow(bonus);

    bonus.setActive(true).setVisible(true);
    bonus.setAlpha(1);
    bonus.setRotation(0);
    bonus.setDepth(config.depth);
    bonus.setDisplaySize(config.width, config.height);

    const body = bonus.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }
    body.setAllowGravity(false);
    body.setSize(Math.round(config.width * 0.72), Math.round(config.height * 0.72), true);

    const speedX = Phaser.Math.Between(0, 1) === 0 ? -config.zigzagHorizontalSpeed : config.zigzagHorizontalSpeed;
    bonus.setVelocity(speedX, this.getBaseFallSpeedByKmh(this.speedKmh) * config.speedYMultiplier);
    bonus.setData("collecting", false);
    bonus.setData("bonusType", type);
    bonus.setData("speedYMultiplier", config.speedYMultiplier);
    bonus.setData("zigzagHorizontalSpeed", config.zigzagHorizontalSpeed);
    bonus.setData("zigzagLeftBoundOffset", config.zigzagLeftBoundOffset);
    bonus.setData("zigzagRightBoundOffset", config.zigzagRightBoundOffset);
    bonus.setData("shadowYOffset", config.shadowYOffset);
    bonus.setData("shadowAlpha", config.shadowAlpha);
    bonus.setData("cleanupPadding", config.height * 1.5);
    bonus.setData("shadowBaseScaleX", config.shadowBobScale.baseScaleX);
    bonus.setData("shadowBaseScaleY", config.shadowBobScale.baseScaleY);
    bonus.setData("shadowResponseX", config.shadowBobScale.responseX);
    bonus.setData("shadowResponseY", config.shadowBobScale.responseY);
    bonus.setData("shadowMinScaleX", config.shadowBobScale.minScaleX);
    bonus.setData("shadowMaxScaleX", config.shadowBobScale.maxScaleX);
    bonus.setData("shadowMinScaleY", config.shadowBobScale.minScaleY);
    bonus.setData("shadowMaxScaleY", config.shadowBobScale.maxScaleY);
    bonus.setData("yBobAmplitude", config.yBobAmplitudePx);
    bonus.setData("yBobFrequency", config.yBobFrequencyHz);
    bonus.setData("yBobPhase", Phaser.Math.FloatBetween(config.yBobPhaseMin, config.yBobPhaseMax));
    bonus.setData("yBobOffsetPrev", 0);

    const shadow = this.add.image(bonus.x, bonus.y + config.shadowYOffset, config.shadowTextureKey);
    shadow.setDisplaySize(config.shadowWidth, config.shadowHeight);
    shadow.setScale(config.shadowBobScale.baseScaleX, config.shadowBobScale.baseScaleY);
    shadow.setAlpha(config.shadowAlpha);
    shadow.setDepth(config.shadowDepth);
    bonus.setData("shadow", shadow);
  }

  private spawnCoin(x: number) {
    const coin = this.coins.get(x, SEGMENT_SPAWN.objectSpawnY, COIN_CONFIG.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!coin) {
      return;
    }

    this.destroyTimeBonusShadow(coin);

    coin.setActive(true).setVisible(true);
    coin.setAlpha(1);
    coin.setRotation(0);
    coin.setDepth(COIN_CONFIG.depth);
    coin.setDisplaySize(COIN_CONFIG.width, COIN_CONFIG.height);

    const body = coin.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }
    body.setAllowGravity(false);
    body.setSize(Math.round(COIN_CONFIG.width * 0.72), Math.round(COIN_CONFIG.height * 0.72), true);

    coin.setVelocity(0, this.getBaseFallSpeedByKmh(this.speedKmh) * COIN_CONFIG.speedYMultiplier);
    coin.setData("collecting", false);
    coin.setData("speedYMultiplier", COIN_CONFIG.speedYMultiplier);
    coin.setData("shadowYOffset", COIN_CONFIG.shadowYOffset);
    coin.setData("shadowAlpha", COIN_CONFIG.shadowAlpha);
    coin.setData("cleanupPadding", COIN_CONFIG.height * 1.5);
    coin.setData("shadowBaseScaleX", COIN_CONFIG.shadowBobScale.baseScaleX);
    coin.setData("shadowBaseScaleY", COIN_CONFIG.shadowBobScale.baseScaleY);
    coin.setData("shadowResponseX", COIN_CONFIG.shadowBobScale.responseX);
    coin.setData("shadowResponseY", COIN_CONFIG.shadowBobScale.responseY);
    coin.setData("shadowMinScaleX", COIN_CONFIG.shadowBobScale.minScaleX);
    coin.setData("shadowMaxScaleX", COIN_CONFIG.shadowBobScale.maxScaleX);
    coin.setData("shadowMinScaleY", COIN_CONFIG.shadowBobScale.minScaleY);
    coin.setData("shadowMaxScaleY", COIN_CONFIG.shadowBobScale.maxScaleY);
    coin.setData("yBobAmplitude", COIN_CONFIG.yBobAmplitudePx);
    coin.setData("yBobFrequency", COIN_CONFIG.yBobFrequencyHz);
    coin.setData("yBobPhase", Phaser.Math.FloatBetween(COIN_CONFIG.yBobPhaseMin, COIN_CONFIG.yBobPhaseMax));
    coin.setData("yBobOffsetPrev", 0);
    coin.setData("isCoin", true);

    const shadow = this.add.image(coin.x, coin.y + COIN_CONFIG.shadowYOffset, COIN_CONFIG.shadowTextureKey);
    shadow.setDisplaySize(COIN_CONFIG.shadowWidth, COIN_CONFIG.shadowHeight);
    shadow.setScale(COIN_CONFIG.shadowBobScale.baseScaleX, COIN_CONFIG.shadowBobScale.baseScaleY);
    shadow.setAlpha(COIN_CONFIG.shadowAlpha);
    shadow.setDepth(COIN_CONFIG.shadowDepth);
    coin.setData("shadow", shadow);
  }

  private spawnRock(type: "rock1" | "rock2" | "rock3", x: number) {
    const rockCfg = ROCK_CONFIG[type];
    const sprite = this.solids.get(x, SEGMENT_SPAWN.objectSpawnY, rockCfg.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareSolidSprite(sprite, type, rockCfg.width, rockCfg.height, ROCK_CONFIG.common.depth, rockCfg.ellipse, false);
    sprite.setVelocityY(this.getBaseFallSpeedByKmh(this.speedKmh) * ROCK_CONFIG.common.speedYMultiplier);
    sprite.setData("solidDamageCooldownMs", 0);
  }

  private spawnLandmark(type: "island1" | "island2" | "harbor", x: number) {
    const cfg = LANDMARK_CONFIG[type];
    const sprite = this.solids.get(x, SEGMENT_SPAWN.objectSpawnY, cfg.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!sprite) {
      return;
    }

    this.prepareSolidSprite(sprite, type, cfg.width, cfg.height, cfg.depth, cfg.ellipse, false);
    sprite.setVelocityY(this.getBaseFallSpeedByKmh(this.speedKmh));
    sprite.setData("solidDamageCooldownMs", 0);
  }

  private spawnHarborGate(x: number) {
    const baseGateWidth = this.playAreaRight - this.playAreaLeft;
    const gateWidth = Math.max(24, baseGateWidth - LANDMARK_CONFIG.gate.widthPaddingPx * 2);
    const gateAnchor = Phaser.Math.Clamp(LANDMARK_CONFIG.gate.anchorCenterYRatio, 0, 1);
    const gateY = SEGMENT_SPAWN.objectSpawnY + LANDMARK_CONFIG.harbor.height * (gateAnchor - 0.5);

    this.harborGate?.destroy();

    const gate = this.physics.add.image(x, gateY, "yacht-rect");
    gate.setVisible(false);
    gate.setAlpha(0);
    gate.setImmovable(true);
    gate.body.setAllowGravity(false);
    gate.setDisplaySize(gateWidth, LANDMARK_CONFIG.gate.height);
    gate.body.setSize(gateWidth, LANDMARK_CONFIG.gate.height, true);
    gate.setDepth(LANDMARK_CONFIG.gate.depth);
    gate.setVelocity(0, this.getBaseFallSpeedByKmh(this.speedKmh));

    this.harborGate = gate;

    if (this.yachtBody) {
      this.physics.add.overlap(this.yachtBody, gate, () => {
        if (!this.isGameOver) {
          this.finishRunSuccess("success_harbor_610");
        }
      });
    }
  }

  private prepareSolidSprite(
    sprite: Phaser.Physics.Arcade.Sprite,
    solidType: SolidType,
    width: number,
    height: number,
    depth: number,
    ellipse: EllipseHitbox,
    damageEnabled: boolean,
  ) {
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }

    sprite.setActive(true).setVisible(true);
    sprite.setAlpha(1);
    sprite.setRotation(0);
    sprite.setScale(1);
    sprite.setDepth(depth);
    sprite.setDisplaySize(width, height);
    body.setAllowGravity(false);
    body.setImmovable(true);
    this.applyEllipseBody(sprite, ellipse);

    sprite.setData("collecting", false);
    sprite.setData("solidType", solidType);
    sprite.setData("solidDamageEnabled", damageEnabled);
    sprite.setData("solidEllipse", ellipse);
    this.ensureObjectCollisionId(sprite);
  }

  private applyEllipseBody(sprite: Phaser.Physics.Arcade.Sprite, ellipse: EllipseHitbox) {
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }

    const radiusX = Math.max(1, Math.round(sprite.displayWidth * ellipse.radiusXRatio));
    const radiusY = Math.max(1, Math.round(sprite.displayHeight * ellipse.radiusYRatio));
    body.setSize(radiusX * 2, radiusY * 2, true);
    body.setOffset(
      Math.round(sprite.displayWidth * ellipse.centerXRatio - radiusX),
      Math.round(sprite.displayHeight * ellipse.centerYRatio - radiusY),
    );
  }

  private handleHazardContact(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!this.yachtHazardCollider) {
      return;
    }

    const hazardType = (sprite.getData("hazardType") as HazardType | undefined) ?? "mine";
    const collisionCooldown = (sprite.getData("collisionCooldownMs") as number | undefined) ?? 200;
    const pairKey = this.getCollisionPairKey(this.yachtHazardCollider, sprite);
    const lastHitAt = this.collisionPairLastHit.get(pairKey) ?? Number.NEGATIVE_INFINITY;
    if (this.time.now - lastHitAt < collisionCooldown) {
      return;
    }
    this.collisionPairLastHit.set(pairKey, this.time.now);

    if (hazardType === "dynamicBuoy") {
      this.handleDynamicBuoyContact(sprite);
      return;
    }

    const shieldHazardMap: Record<Exclude<HazardType, "dynamicBuoy">, ShieldHazardKey> = {
      moneyDown: "moneyDown",
      mine: "mine",
      pirate: "pirate",
      whirlpool: "whirlpool",
    };
    const shieldHazardKey = shieldHazardMap[hazardType];
    if (this.isShieldInvulnerabilityActiveForHazard(shieldHazardKey)) {
      this.applyShieldContactPushByType(sprite, shieldHazardKey);
      return;
    }

    if (hazardType === "moneyDown") {
      this.applyFuelDamage(HAZARD_DAMAGE.moneyDown, false);
    } else {
      this.finishRunFailure("hit_hazard");
      return;
    }

    const applyImpact = (sprite.getData("applyImpactAnimation") as boolean | undefined) ?? true;
    const destroyOnContact = (sprite.getData("destroyOnContact") as boolean | undefined) ?? applyImpact;
    if (applyImpact) {
      this.playImpactDestroyAnimation(sprite);
      return;
    }

    if (destroyOnContact && sprite.active) {
      sprite.destroy();
    }
  }

  private handleDynamicBuoyContact(sprite: Phaser.Physics.Arcade.Sprite) {
    const state = this.getDynamicBuoyCollisionState(sprite);
    if (state === "up") {
      this.assetsValue = Math.min(1, this.assetsValue + DYNAMIC_BUOY_STATES.up.fuelDelta);
      this.refreshShieldDurationByPickup("dynamicUp");
      this.triggerGreenHitFeedback();
      this.collectFuel(sprite);
      return;
    }

    if (this.isShieldInvulnerabilityActiveForHazard("dynamicDown")) {
      this.applyShieldContactPushByType(sprite, "dynamicDown");
      return;
    }

    this.applyFuelDamage(DYNAMIC_BUOY_STATES.down.fuelPenalty, false);

    const applyImpact = (sprite.getData("applyImpactAnimation") as boolean | undefined) ?? true;
    const destroyOnContact = (sprite.getData("destroyOnContact") as boolean | undefined) ?? applyImpact;
    if (applyImpact) {
      this.playImpactDestroyAnimation(sprite);
      return;
    }
    if (destroyOnContact && sprite.active) {
      this.stopDynamicBuoyStateTimer(sprite);
      sprite.destroy();
    }
  }

  private applyObstacleSlowdown() {
    if (!OBSTACLE_SLOWDOWN.enabled) {
      return;
    }
    this.obstacleSlowdownUntilMs = Math.max(this.obstacleSlowdownUntilMs, this.time.now + OBSTACLE_SLOWDOWN.hitDurationMs);
  }

  private getDynamicBuoyCollisionState(sprite: Phaser.Physics.Arcade.Sprite): DynamicBuoyGameplayState {
    const state = sprite.getData("dynamicState") as string | undefined;
    if (state === "up" || state === "down") {
      return state;
    }

    if (state === "blink" && DYNAMIC_BUOY_BLINK.lockCollisionToSourceState) {
      const source = sprite.getData("dynamicBlinkSourceState") as string | undefined;
      if (source === "up" || source === "down") {
        return source;
      }
    }

    const fallback = sprite.getData("dynamicBlinkSourceState") as string | undefined;
    return fallback === "down" ? "down" : "up";
  }

  private applyDynamicBuoyVisualState(sprite: Phaser.Physics.Arcade.Sprite, visualState: DynamicBuoyVisualState) {
    const alignment = DYNAMIC_BUOY_BLINK.stateTextureAlignment[visualState];
    const prevOffsetX = (sprite.getData("dynamicVisualOffsetX") as number | undefined) ?? 0;
    const prevOffsetY = (sprite.getData("dynamicVisualOffsetY") as number | undefined) ?? 0;
    const nextOffsetX = alignment.offsetX;
    const nextOffsetY = alignment.offsetY;

    sprite.setTexture(DYNAMIC_BUOY_STATES[visualState].textureKey);
    sprite.setDisplaySize(alignment.displayWidth * alignment.scaleX, alignment.displayHeight * alignment.scaleY);
    sprite.setData("baseScaleX", sprite.scaleX);
    sprite.setData("baseScaleY", sprite.scaleY);
    this.applyEllipseBody(sprite, DYNAMIC_BUOY_CONFIG.hitbox);

    const deltaOffsetX = nextOffsetX - prevOffsetX;
    const deltaOffsetY = nextOffsetY - prevOffsetY;
    if (deltaOffsetX !== 0 || deltaOffsetY !== 0) {
      sprite.x += deltaOffsetX;
      sprite.y += deltaOffsetY;
      const driftBaseX = sprite.getData("driftBaseX") as number | undefined;
      if (typeof driftBaseX === "number") {
        sprite.setData("driftBaseX", driftBaseX + deltaOffsetX);
      }
    }

    sprite.setData("dynamicVisualOffsetX", nextOffsetX);
    sprite.setData("dynamicVisualOffsetY", nextOffsetY);
  }

  private getDynamicBuoyBlinkTiming() {
    const flashCount = Math.max(1, DYNAMIC_BUOY_BLINK.flashCountDefault);
    let preHoldMs = Math.max(0, DYNAMIC_BUOY_BLINK.preHoldMs);
    let postHoldMs = Math.max(0, DYNAMIC_BUOY_BLINK.postHoldMs);
    let flashOnMs = Math.max(1, DYNAMIC_BUOY_BLINK.flashOnMs);
    let flashOffMs = Math.max(1, DYNAMIC_BUOY_BLINK.flashOffMs);

    const baseDuration = preHoldMs + postHoldMs + flashCount * (flashOnMs + flashOffMs);
    const shouldScale = DYNAMIC_BUOY_BLINK.scaleToTotalDuration && DYNAMIC_BUOY_BLINK.totalDurationMs > 0 && baseDuration > 0;
    if (shouldScale) {
      const scale = DYNAMIC_BUOY_BLINK.totalDurationMs / baseDuration;
      preHoldMs *= scale;
      postHoldMs *= scale;
      flashOnMs *= scale;
      flashOffMs *= scale;
    }

    return {
      flashCount,
      preHoldMs: Math.max(1, Math.round(preHoldMs)),
      postHoldMs: Math.max(1, Math.round(postHoldMs)),
      flashOnMs: Math.max(1, Math.round(flashOnMs)),
      flashOffMs: Math.max(1, Math.round(flashOffMs)),
    };
  }

  private scheduleDynamicBuoyTimer(sprite: Phaser.Physics.Arcade.Sprite, delayMs: number, callback: () => void) {
    this.stopDynamicBuoyStateTimer(sprite);
    const timer = this.time.delayedCall(Math.max(1, Math.round(delayMs)), callback);
    sprite.setData("stateTimer", timer);
  }

  private scheduleDynamicBuoyDwell(sprite: Phaser.Physics.Arcade.Sprite, state: DynamicBuoyGameplayState) {
    const dwellMs = state === "up" ? DYNAMIC_BUOY_STATES.up.dwellMs : DYNAMIC_BUOY_STATES.down.dwellMs;
    this.scheduleDynamicBuoyTimer(sprite, dwellMs, () => {
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      this.startDynamicBuoyBlink(sprite);
    });
  }

  private startDynamicBuoyBlink(sprite: Phaser.Physics.Arcade.Sprite) {
    const sourceState = this.getDynamicBuoyCollisionState(sprite);
    const targetState: DynamicBuoyGameplayState = sourceState === "up" ? "down" : "up";
    const timing = this.getDynamicBuoyBlinkTiming();
    let flashesLeft = timing.flashCount;

    sprite.setData("dynamicState", "blink");
    sprite.setData("dynamicBlinkSourceState", sourceState);
    sprite.setData("dynamicBlinkTargetState", targetState);
    this.applyDynamicBuoyVisualState(sprite, sourceState);

    const finalize = () => {
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      sprite.setData("dynamicState", targetState);
      sprite.setData("dynamicBlinkSourceState", targetState);
      sprite.setData("dynamicBlinkTargetState", sourceState);
      this.applyDynamicBuoyVisualState(sprite, targetState);
      this.scheduleDynamicBuoyDwell(sprite, targetState);
    };

    const showSource = () => {
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      this.applyDynamicBuoyVisualState(sprite, sourceState);
      flashesLeft -= 1;
      if (flashesLeft <= 0) {
        this.scheduleDynamicBuoyTimer(sprite, timing.postHoldMs, finalize);
      } else {
        this.scheduleDynamicBuoyTimer(sprite, timing.flashOnMs, showNo);
      }
    };

    const showNo = () => {
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      this.applyDynamicBuoyVisualState(sprite, "no");
      this.scheduleDynamicBuoyTimer(sprite, timing.flashOffMs, showSource);
    };

    this.scheduleDynamicBuoyTimer(sprite, timing.preHoldMs, showNo);
  }

  private stopDynamicBuoyStateTimer(sprite: Phaser.Physics.Arcade.Sprite) {
    const timer = sprite.getData("stateTimer") as Phaser.Time.TimerEvent | undefined;
    if (timer) {
      timer.remove(false);
      sprite.setData("stateTimer", undefined);
    }
  }

  private stopAllDynamicBuoyStateTimers() {
    if (!this.isPhysicsGroupUsable(this.hazards)) {
      return;
    }
    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      const hazardType = sprite.getData("hazardType") as HazardType | undefined;
      if (hazardType === "dynamicBuoy") {
        this.stopDynamicBuoyStateTimer(sprite);
      }
    });
  }

  private canUseBuoyCollisionPush(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!BUOY_COLLISION_LAYER.enabled || !sprite.active) {
      return false;
    }
    const isCollecting = !!sprite.getData("collecting");
    if (!BUOY_COLLISION_LAYER.allowCollectingObjects && isCollecting) {
      return false;
    }

    const actorType = this.getBuoyCollisionActorType(sprite);
    if (!this.isBuoyCollisionActorEnabled(actorType)) {
      return false;
    }

    const hazardType = actorType === "moneyUp" ? undefined : actorType;
    const blocking = sprite.getData("blocking") as boolean | undefined;
    if (blocking === false && hazardType) {
      const allowNonBlocking = BUOY_COLLISION_LAYER.allowNonBlockingHazards[hazardType] ?? false;
      if (!allowNonBlocking) {
        return false;
      }
    }
    return true;
  }

  private canBlockAgainstSolids(sprite: Phaser.Physics.Arcade.Sprite, solidSprite: Phaser.Physics.Arcade.Sprite) {
    if (!BUOY_COLLISION_LAYER.enabled || !sprite.active || !solidSprite.active) {
      return false;
    }
    const isCollecting = !!sprite.getData("collecting");
    if (!BUOY_COLLISION_LAYER.allowCollectingObjects && isCollecting) {
      return false;
    }

    const actorType = this.getBuoyCollisionActorType(sprite);
    if (!this.isBuoyCollisionActorEnabled(actorType)) {
      return false;
    }

    const hazardType = actorType === "moneyUp" ? undefined : actorType;
    const blocking = sprite.getData("blocking") as boolean | undefined;
    if (blocking === false && hazardType) {
      const allowNonBlocking = BUOY_COLLISION_LAYER.allowNonBlockingHazards[hazardType] ?? false;
      if (!allowNonBlocking) {
        return false;
      }
    }

    const solidType = solidSprite.getData("solidType") as SolidType | undefined;
    if (!solidType) {
      return false;
    }
    return BUOY_COLLISION_LAYER.solids[solidType] ?? false;
  }

  private canYachtBeBlockedBySolid(solidSprite: Phaser.Physics.Arcade.Sprite) {
    if (!solidSprite.active) {
      return false;
    }
    const solidType = solidSprite.getData("solidType") as SolidType | undefined;
    if (!solidType) {
      return false;
    }
    return YACHT_SOLID_BLOCKERS[solidType] ?? true;
  }

  private getBuoyCollisionActorType(sprite: Phaser.Physics.Arcade.Sprite): BuoyCollisionActorType {
    const hazardType = sprite.getData("hazardType") as HazardType | undefined;
    if (hazardType) {
      return hazardType;
    }
    return "moneyUp";
  }

  private isBuoyCollisionActorEnabled(actorType: BuoyCollisionActorType) {
    if (actorType === "moneyUp") {
      return BUOY_COLLISION_LAYER.participants.moneyUp;
    }
    return BUOY_COLLISION_LAYER.participants[actorType] ?? false;
  }

  private handleBuoyCollision(spriteA: Phaser.Physics.Arcade.Sprite, spriteB: Phaser.Physics.Arcade.Sprite) {
    if (!BUOY_COLLISION_LAYER.enabled) {
      return;
    }
    if (!this.canUseBuoyCollisionPush(spriteA) || !this.canUseBuoyCollisionPush(spriteB)) {
      return;
    }

    const pairKey = this.getBuoyCollisionPairKey(spriteA, spriteB);
    const nowMs = this.time.now;
    const lastHitAt = this.buoyCollisionPairLastHit.get(pairKey) ?? Number.NEGATIVE_INFINITY;
    if (nowMs - lastHitAt < HAZARD_COLLISION.pairCooldownMs) {
      return;
    }
    this.buoyCollisionPairLastHit.set(pairKey, nowMs);

    const bodyA = spriteA.body as Phaser.Physics.Arcade.Body | undefined;
    const bodyB = spriteB.body as Phaser.Physics.Arcade.Body | undefined;
    const ax = bodyA ? bodyA.center.x : spriteA.x;
    const ay = bodyA ? bodyA.center.y : spriteA.y;
    const bx = bodyB ? bodyB.center.x : spriteB.x;
    const by = bodyB ? bodyB.center.y : spriteB.y;
    const dx = ax - bx;
    const dy = ay - by;

    let normalX = dx;
    let normalY = dy;
    const len = Math.hypot(normalX, normalY);
    if (len === 0) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      normalX = Math.cos(angle);
      normalY = Math.sin(angle);
    } else {
      normalX /= len;
      normalY /= len;
    }

    const impulse =
      HAZARD_COLLISION.impulsePxPerSec *
      Phaser.Math.FloatBetween(HAZARD_COLLISION.impulseRandomMin, HAZARD_COLLISION.impulseRandomMax);

    this.applyBuoyCollisionPush(spriteA, normalX, normalY, impulse);
    this.applyBuoyCollisionPush(spriteB, -normalX, -normalY, impulse);
  }

  private getBuoyCollisionPairKey(a: Phaser.Physics.Arcade.Sprite, b: Phaser.Physics.Arcade.Sprite) {
    const aId = this.ensureObjectCollisionId(a);
    const bId = this.ensureObjectCollisionId(b);
    return aId < bId ? `${aId}:${bId}` : `${bId}:${aId}`;
  }

  private applyBuoyCollisionPush(sprite: Phaser.Physics.Arcade.Sprite, normalX: number, normalY: number, impulse: number) {
    const pushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
    const pushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
    const pushX = (sprite.getData("pushX") as number | undefined) ?? 0;
    const nextPushVy = Phaser.Math.Clamp(
      pushVy + normalY * impulse * HAZARD_COLLISION.verticalImpulseFactor,
      -HAZARD_COLLISION.maxVerticalPushPxPerSec,
      HAZARD_COLLISION.maxVerticalPushPxPerSec,
    );

    sprite.setData("pushVx", pushVx + normalX * impulse);
    sprite.setData("pushVy", nextPushVy);
    sprite.setData("pushX", pushX + normalX * HAZARD_COLLISION.separationPx);
    sprite.setData("lastCollisionAt", this.time.now);
  }

  private applyFuelDamage(damage: number, withRedHit = true) {
    this.assetsValue = Math.max(0, this.assetsValue - damage);
    if (withRedHit) {
      this.triggerRedHitEffects();
    }
  }

  private applyPiratePush(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!this.yachtBody) {
      return;
    }

    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    const yachtBody = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body || !yachtBody) {
      return;
    }

    const dx = body.center.x - yachtBody.center.x;
    const dy = body.center.y - yachtBody.center.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;

    const cfg = PIRATE_CONFIG.yachtPush;
    const impulse = cfg.impulsePxPerSec * Phaser.Math.FloatBetween(cfg.impulseRandomMin, cfg.impulseRandomMax);

    const pushVx = ((sprite.getData("pushVx") as number | undefined) ?? 0) + nx * impulse;
    const pushVyBase = ((sprite.getData("pushVy") as number | undefined) ?? 0) + ny * impulse * cfg.verticalImpulseFactor;
    const pushVy = Phaser.Math.Clamp(pushVyBase, -cfg.maxVerticalPushPxPerSec, cfg.maxVerticalPushPxPerSec);

    sprite.setData("pushVx", pushVx);
    sprite.setData("pushVy", pushVy);
    sprite.setData("pushX", ((sprite.getData("pushX") as number | undefined) ?? 0) + nx * cfg.separationPx);
  }

  private playImpactDestroyAnimation(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!sprite.active || sprite.getData("collecting")) {
      return;
    }

    this.stopDynamicBuoyStateTimer(sprite);
    sprite.setData("collecting", true);
    sprite.setVelocity(0, 0);
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (body) {
      body.enable = false;
    }

    const startScaleX = sprite.scaleX;
    const startScaleY = sprite.scaleY;
    const upDuration = IMPACT_ANIMATION.spinDurationMs * IMPACT_ANIMATION.scaleUpPortion;
    const downDuration = IMPACT_ANIMATION.spinDurationMs * IMPACT_ANIMATION.scaleDownPortion;

    this.tweens.add({
      targets: sprite,
      rotation: sprite.rotation + Math.PI * 2,
      duration: IMPACT_ANIMATION.spinDurationMs,
      ease: "Sine.easeOut",
    });

    this.tweens.add({
      targets: sprite,
      scaleX: startScaleX * IMPACT_ANIMATION.scaleUp,
      scaleY: startScaleY * IMPACT_ANIMATION.scaleUp,
      duration: upDuration,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: sprite,
          scaleX: startScaleX * IMPACT_ANIMATION.spinScaleMin,
          scaleY: startScaleY * IMPACT_ANIMATION.spinScaleMin,
          duration: downDuration,
          ease: "Sine.easeIn",
          onComplete: () => {
            if (sprite.active) {
              sprite.destroy();
            }
          },
        });
      },
    });
  }

  private handleSolidColliderContact(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!sprite.active || this.isGameOver) {
      return;
    }

    const id = this.ensureObjectCollisionId(sprite);
    const cooldownMs = (sprite.getData("solidDamageCooldownMs") as number | undefined) ?? 220;
    const last = this.solidDamageLastHit.get(id) ?? Number.NEGATIVE_INFINITY;
    if (this.time.now - last < cooldownMs) {
      return;
    }

    this.solidDamageLastHit.set(id, this.time.now);
    this.applyObstacleSlowdown();
    if (!this.redInvulActive) {
      this.triggerRedHitEffects();
    }
  }

  private updateActiveObjectSpeeds(deltaSec: number) {
    const baseFallSpeed = this.getBaseFallSpeedByKmh(this.speedKmh);

    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }

      const speedMultiplier = (sprite.getData("speedMultiplier") as number | undefined) ?? 1;
      const minSpeed = baseFallSpeed * speedMultiplier * HAZARD_COLLISION.minFallSpeedFactor;
      let pushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
      const damping = Math.max(0, 1 - HAZARD_COLLISION.pushDampingPerSec * deltaSec);
      pushVy *= damping;
      if (Math.abs(pushVy) < 0.5) {
        pushVy = 0;
      }
      sprite.setData("pushVy", pushVy);

      const targetVy = Math.max(minSpeed, baseFallSpeed * speedMultiplier + pushVy);
      sprite.setVelocityY(targetVy);
    });

    this.moneyUps.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }

      const speedMultiplier = (sprite.getData("speedMultiplier") as number | undefined) ?? MONEY_UP_SPEED_MULTIPLIER;
      const minSpeed = baseFallSpeed * speedMultiplier * HAZARD_COLLISION.minFallSpeedFactor;
      let pushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
      const damping = Math.max(0, 1 - HAZARD_COLLISION.pushDampingPerSec * deltaSec);
      pushVy *= damping;
      if (Math.abs(pushVy) < 0.5) {
        pushVy = 0;
      }
      sprite.setData("pushVy", pushVy);

      const targetVy = Math.max(minSpeed, baseFallSpeed * speedMultiplier + pushVy);
      sprite.setVelocityY(targetVy);
    });

    this.timeBonuses.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      const speedYMultiplier = (sprite.getData("speedYMultiplier") as number | undefined) ?? TIME_BONUS.speedYMultiplier;
      sprite.setVelocityY(baseFallSpeed * speedYMultiplier);
    });

    this.coins.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      const speedYMultiplier = (sprite.getData("speedYMultiplier") as number | undefined) ?? COIN_CONFIG.speedYMultiplier;
      sprite.setVelocityY(baseFallSpeed * speedYMultiplier);
    });
  }

  private updateHazardMotion(deltaSec: number) {
    const timeSec = this.time.now / 1000;

    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }

      const hazardType = (sprite.getData("hazardType") as HazardType | undefined) ?? "mine";

      const baseX = (sprite.getData("driftBaseX") as number | undefined) ?? sprite.x;
      const amplitude = (sprite.getData("driftAmplitude") as number | undefined) ?? 0;
      const frequency = (sprite.getData("driftFrequency") as number | undefined) ?? 0;
      const phase = (sprite.getData("driftPhase") as number | undefined) ?? 0;

      let pushX = (sprite.getData("pushX") as number | undefined) ?? 0;
      let pushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;

      pushX += pushVx * deltaSec;
      pushX = Phaser.Math.Clamp(pushX, -HAZARD_COLLISION.maxPushOffsetPx, HAZARD_COLLISION.maxPushOffsetPx);
      const damping = Math.max(0, 1 - HAZARD_COLLISION.pushDampingPerSec * deltaSec);
      pushVx *= damping;
      if (Math.abs(pushVx) < 0.5) {
        pushVx = 0;
      }
      if (pushVx === 0 && Math.abs(pushX) < 0.1) {
        pushX = 0;
      }

      sprite.setData("pushX", pushX);
      sprite.setData("pushVx", pushVx);

      const driftX = baseX + Math.sin(timeSec * frequency + phase) * amplitude;
      sprite.x = Phaser.Math.Clamp(driftX + pushX, this.playAreaLeft - 150, this.playAreaRight + 150);

      const swayPhase = (sprite.getData("swayPhase") as number | undefined) ?? 0;
      const swayFrequency = (sprite.getData("swayFrequency") as number | undefined) ?? 1;
      const swayAmplitudeDeg = (sprite.getData("swayAmplitudeDeg") as number | undefined) ?? 0;
      const sway = Math.sin(timeSec * swayFrequency + swayPhase);
      const baseScaleX = (sprite.getData("baseScaleX") as number | undefined) ?? 1;
      const baseScaleY = (sprite.getData("baseScaleY") as number | undefined) ?? 1;

      if (hazardType === "whirlpool") {
        const phase = (sprite.getData("whirlpoolPulsePhase") as number | undefined) ?? 0;
        const pulseScaleRaw =
          WHIRLPOOL_CONFIG.pulse.baseScale +
          Math.sin(timeSec * WHIRLPOOL_CONFIG.pulse.frequencyHz + phase) * WHIRLPOOL_CONFIG.pulse.amplitude;
        const pulseScale = Phaser.Math.Clamp(pulseScaleRaw, WHIRLPOOL_CONFIG.pulse.minScale, WHIRLPOOL_CONFIG.pulse.maxScale);
        sprite.setScale(baseScaleX * pulseScale, baseScaleY * pulseScale);
        sprite.setRotation(Phaser.Math.DegToRad(swayAmplitudeDeg) * sway);
        return;
      }

      sprite.setScale(baseScaleX, baseScaleY);

      if (hazardType === "pirate" && PIRATE_CONFIG.turnNoseToVelocity) {
        const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
        const velocityX = (body?.velocity.x ?? 0) + pushVx;
        const velocityY = body?.velocity.y ?? 0;
        const angle = Math.atan2(velocityY, velocityX) + Phaser.Math.DegToRad(PIRATE_CONFIG.noseRotationOffsetDeg);
        sprite.setRotation(angle + Phaser.Math.DegToRad(swayAmplitudeDeg) * sway * 0.25);
      } else {
        sprite.setRotation(Phaser.Math.DegToRad(swayAmplitudeDeg) * sway);
      }
    });
  }

  private updateMoneyUps(_deltaSec: number) {
    const timeSec = this.time.now / 1000;
    this.moneyUps.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }

      const baseX = (sprite.getData("driftBaseX") as number | undefined) ?? sprite.x;
      const amplitude = (sprite.getData("driftAmplitude") as number | undefined) ?? 0;
      const frequency = (sprite.getData("driftFrequency") as number | undefined) ?? 0;
      const phase = (sprite.getData("driftPhase") as number | undefined) ?? 0;
      let pushX = (sprite.getData("pushX") as number | undefined) ?? 0;
      let pushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
      pushX += pushVx * _deltaSec;
      pushX = Phaser.Math.Clamp(pushX, -HAZARD_COLLISION.maxPushOffsetPx, HAZARD_COLLISION.maxPushOffsetPx);
      const damping = Math.max(0, 1 - HAZARD_COLLISION.pushDampingPerSec * _deltaSec);
      pushVx *= damping;
      if (Math.abs(pushVx) < 0.5) {
        pushVx = 0;
      }
      if (pushVx === 0 && Math.abs(pushX) < 0.1) {
        pushX = 0;
      }
      sprite.setData("pushX", pushX);
      sprite.setData("pushVx", pushVx);

      sprite.x = baseX + Math.sin(timeSec * frequency + phase) * amplitude + pushX;

      const swayPhase = (sprite.getData("swayPhase") as number | undefined) ?? 0;
      const sway = Math.sin(timeSec * MONEY_UP_SWAY_FREQUENCY_HZ + swayPhase);
      sprite.setRotation(Phaser.Math.DegToRad(MONEY_UP_SWAY_AMPLITUDE_DEG) * sway);
    });
  }

  private updateCoins() {
    const timeSec = this.time.now / 1000;
    this.coins.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }

      let normalizedBob = 0;
      if (!sprite.getData("collecting")) {
        const yBobAmplitude = (sprite.getData("yBobAmplitude") as number | undefined) ?? COIN_CONFIG.yBobAmplitudePx;
        const yBobFrequency = (sprite.getData("yBobFrequency") as number | undefined) ?? COIN_CONFIG.yBobFrequencyHz;
        const yBobPhase = (sprite.getData("yBobPhase") as number | undefined) ?? 0;
        const prevOffset = (sprite.getData("yBobOffsetPrev") as number | undefined) ?? 0;
        const nextOffset = Math.sin(timeSec * yBobFrequency * Math.PI * 2 + yBobPhase) * yBobAmplitude;
        sprite.y += nextOffset - prevOffset;
        sprite.setData("yBobOffsetPrev", nextOffset);
        normalizedBob = yBobAmplitude > 0 ? Phaser.Math.Clamp(nextOffset / yBobAmplitude, -1, 1) : 0;
        sprite.setVelocityX(0);
      }

      const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
      if (shadow && shadow.active) {
        const shadowYOffset = (sprite.getData("shadowYOffset") as number | undefined) ?? COIN_CONFIG.shadowYOffset;
        shadow.setPosition(sprite.x, sprite.y + shadowYOffset);
        const shadowScale = this.getAirBonusShadowScaleByBob(sprite, normalizedBob);
        shadow.setScale(shadowScale.scaleX, shadowScale.scaleY);
      }
    });
  }

  private updateTimeBonuses() {
    const timeSec = this.time.now / 1000;
    this.timeBonuses.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }

      const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
      if (!body) {
        return;
      }

      let normalizedBob = 0;
      if (!sprite.getData("collecting")) {
        const zigzagLeftOffset = (sprite.getData("zigzagLeftBoundOffset") as number | undefined) ?? TIME_BONUS.zigzagLeftBoundOffset;
        const zigzagRightOffset = (sprite.getData("zigzagRightBoundOffset") as number | undefined) ?? TIME_BONUS.zigzagRightBoundOffset;
        const zigzagSpeed = (sprite.getData("zigzagHorizontalSpeed") as number | undefined) ?? TIME_BONUS.zigzagHorizontalSpeed;
        const leftBound = this.playAreaLeft - zigzagLeftOffset;
        const rightBound = this.playAreaRight + zigzagRightOffset;
        if (sprite.x <= leftBound && body.velocity.x < 0) {
          sprite.setVelocityX(zigzagSpeed);
        } else if (sprite.x >= rightBound && body.velocity.x > 0) {
          sprite.setVelocityX(-zigzagSpeed);
        }

        const yBobAmplitude = (sprite.getData("yBobAmplitude") as number | undefined) ?? 0;
        const yBobFrequency = (sprite.getData("yBobFrequency") as number | undefined) ?? 0;
        const yBobPhase = (sprite.getData("yBobPhase") as number | undefined) ?? 0;
        const prevOffset = (sprite.getData("yBobOffsetPrev") as number | undefined) ?? 0;
        const nextOffset = Math.sin(timeSec * yBobFrequency * Math.PI * 2 + yBobPhase) * yBobAmplitude;
        sprite.y += nextOffset - prevOffset;
        sprite.setData("yBobOffsetPrev", nextOffset);
        normalizedBob = yBobAmplitude > 0 ? Phaser.Math.Clamp(nextOffset / yBobAmplitude, -1, 1) : 0;
      }

      const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
      if (shadow && shadow.active) {
        const shadowYOffset = (sprite.getData("shadowYOffset") as number | undefined) ?? TIME_BONUS.shadowYOffset;
        shadow.setPosition(sprite.x, sprite.y + shadowYOffset);
        const shadowScale = this.getAirBonusShadowScaleByBob(sprite, normalizedBob);
        shadow.setScale(shadowScale.scaleX, shadowScale.scaleY);
      }
    });
  }

  private getAirBonusShadowScaleByBob(sprite: Phaser.Physics.Arcade.Sprite, normalizedBob: number) {
    const baseScaleX = (sprite.getData("shadowBaseScaleX") as number | undefined) ?? TIME_BONUS.shadowBobScale.baseScaleX;
    const baseScaleY = (sprite.getData("shadowBaseScaleY") as number | undefined) ?? TIME_BONUS.shadowBobScale.baseScaleY;
    const responseX = (sprite.getData("shadowResponseX") as number | undefined) ?? TIME_BONUS.shadowBobScale.responseX;
    const responseY = (sprite.getData("shadowResponseY") as number | undefined) ?? TIME_BONUS.shadowBobScale.responseY;
    const minScaleX = (sprite.getData("shadowMinScaleX") as number | undefined) ?? TIME_BONUS.shadowBobScale.minScaleX;
    const maxScaleX = (sprite.getData("shadowMaxScaleX") as number | undefined) ?? TIME_BONUS.shadowBobScale.maxScaleX;
    const minScaleY = (sprite.getData("shadowMinScaleY") as number | undefined) ?? TIME_BONUS.shadowBobScale.minScaleY;
    const maxScaleY = (sprite.getData("shadowMaxScaleY") as number | undefined) ?? TIME_BONUS.shadowBobScale.maxScaleY;
    const clampedBob = Phaser.Math.Clamp(normalizedBob, -1, 1);

    return {
      scaleX: Phaser.Math.Clamp(baseScaleX + clampedBob * responseX, minScaleX, maxScaleX),
      scaleY: Phaser.Math.Clamp(baseScaleY + clampedBob * responseY, minScaleY, maxScaleY),
    };
  }

  private updateSolidVelocities() {
    const speed = this.getBaseFallSpeedByKmh(this.speedKmh);

    this.solids.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }

      const solidType = sprite.getData("solidType") as SolidType | undefined;
      if (!solidType) {
        return;
      }

      let multiplier = 1;
      if (solidType === "rock1" || solidType === "rock2" || solidType === "rock3") {
        multiplier = ROCK_CONFIG.common.speedYMultiplier;
      }
      sprite.setVelocityY(speed * multiplier);
    });

    if (this.harborGate?.active) {
      this.harborGate.setVelocityY(speed);
    }
  }

  private resolveYachtVsSolidEllipses() {
    if (!this.yachtBody) {
      return;
    }

    const yachtEllipse = this.getYachtSolidEllipseParams();
    if (!yachtEllipse) {
      return;
    }

    this.solids.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }

      if (!this.canYachtBeBlockedBySolid(sprite)) {
        return;
      }

      const ellipse = sprite.getData("solidEllipse") as EllipseHitbox | undefined;
      if (!ellipse) {
        return;
      }

      const blockerCenterX = sprite.x + sprite.displayWidth * (ellipse.centerXRatio - 0.5);
      const blockerCenterY = sprite.y + sprite.displayHeight * (ellipse.centerYRatio - 0.5);
      const blockerRadiusX = sprite.displayWidth * ellipse.radiusXRatio;
      const blockerRadiusY = sprite.displayHeight * ellipse.radiusYRatio;

      const combinedRadiusX = blockerRadiusX + yachtEllipse.radiusX;
      const combinedRadiusY = blockerRadiusY + yachtEllipse.radiusY;

      const dx = yachtEllipse.centerX - blockerCenterX;
      const dy = yachtEllipse.centerY - blockerCenterY;
      const nx = dx / Math.max(1e-6, combinedRadiusX);
      const ny = dy / Math.max(1e-6, combinedRadiusY);
      const distanceNormSq = nx * nx + ny * ny;

      if (distanceNormSq >= 1) {
        return;
      }

      let normalX = dx / (combinedRadiusX * combinedRadiusX);
      let normalY = dy / (combinedRadiusY * combinedRadiusY);
      let normalLen = Math.hypot(normalX, normalY);

      if (normalLen < 1e-6) {
        normalX = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        normalY = 0;
        normalLen = 1;
      }

      normalX /= normalLen;
      normalY /= normalLen;

      const penetration = 1 - Math.sqrt(Math.max(0, distanceNormSq));
      const pushDistance = Math.max(1, penetration * Math.max(combinedRadiusX, combinedRadiusY) + 1);

      this.yachtBody!.x += normalX * pushDistance;
      this.yachtBody!.y += normalY * pushDistance;
      this.yachtBody!.x = Phaser.Math.Clamp(this.yachtBody!.x, this.controlMinX, this.controlMaxX);
      this.yachtBody!.y = Phaser.Math.Clamp(this.yachtBody!.y, this.controlMinY, this.controlMaxY);

      this.targetX = this.yachtBody!.x;
      this.targetY = this.yachtBody!.y - this.yMotionOffsetPx;
      this.desiredTargetX = this.targetX;
      this.desiredTargetY = this.targetY;

      this.handleSolidColliderContact(sprite);
    });
  }

  private getYachtSolidEllipseParams(): EllipseHitboxParams | null {
    if (!this.yachtBody) {
      return null;
    }

    const body = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    const centerX = (body ? body.center.x : this.yachtBody.x) + YACHT_SOLID_COLLISION.centerOffsetX;
    const centerY = (body ? body.center.y : this.yachtBody.y) + YACHT_SOLID_COLLISION.centerOffsetY;
    const baseWidth = body ? body.width : OBJECT_SIZES.yacht.width;
    const baseHeight = body ? body.height : OBJECT_SIZES.yacht.height;
    const radiusX = Math.max(YACHT_SOLID_COLLISION.minRadiusX, baseWidth * YACHT_SOLID_COLLISION.radiusXRatio);
    const radiusY = Math.max(YACHT_SOLID_COLLISION.minRadiusY, baseHeight * YACHT_SOLID_COLLISION.radiusYRatio);
    return { centerX, centerY, radiusX, radiusY };
  }

  private cleanupFallingObjects() {
    const maxY = this.scale.height + SEGMENT_SPAWN.cleanupYExtra;

    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }
      if (sprite.y > maxY) {
        this.stopDynamicBuoyStateTimer(sprite);
        sprite.destroy();
      }
    });

    this.moneyUps.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && sprite.y > maxY) {
        sprite.destroy();
      }
    });

    this.timeBonuses.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      const cleanupPadding = (sprite.getData("cleanupPadding") as number | undefined) ?? TIME_BONUS.height * 1.5;
      const minX = -cleanupPadding;
      const maxX = this.scale.width + cleanupPadding;
      const isOutByY = sprite.y > maxY;
      const isOutByX = sprite.x < minX || sprite.x > maxX;
      if (sprite.active && !sprite.getData("collecting") && (isOutByY || isOutByX)) {
        this.destroyTimeBonusShadow(sprite);
        sprite.destroy();
      }
    });

    this.coins.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      const cleanupPadding = (sprite.getData("cleanupPadding") as number | undefined) ?? COIN_CONFIG.height * 1.5;
      const minX = -cleanupPadding;
      const maxX = this.scale.width + cleanupPadding;
      const isOutByY = sprite.y > maxY;
      const isOutByX = sprite.x < minX || sprite.x > maxX;
      if (sprite.active && !sprite.getData("collecting") && (isOutByY || isOutByX)) {
        this.destroyTimeBonusShadow(sprite);
        sprite.destroy();
      }
    });

    this.solids.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && sprite.y > this.scale.height + 240) {
        sprite.destroy();
      }
    });

    if (this.harborGate && this.harborGate.active && this.harborGate.y > this.scale.height + 240) {
      this.harborGate.destroy();
      this.harborGate = undefined;
    }
  }

  private collectMoneyUp(sprite: Phaser.Physics.Arcade.Sprite) {
    this.assetsValue = Math.min(1, this.assetsValue + TUNING.FUEL_PICKUP_VALUE);
    this.refreshShieldDurationByPickup("moneyUp");
    this.triggerGreenHitFeedback();
    this.collectFuel(sprite);
  }

  private collectFuel(sprite: Phaser.Physics.Arcade.Sprite, animationType: CollectAnimationType = "buoy") {
    const config = animationType === "timeBonus" ? COLLECT_ANIMATION_TIME_BONUS : COLLECT_ANIMATION_BUOY;

    this.stopDynamicBuoyStateTimer(sprite);
    if (!this.yachtVisual) {
      this.destroyTimeBonusShadow(sprite);
      sprite.destroy();
      return;
    }

    sprite.setData("collecting", true);
    sprite.setVelocity(0, 0);
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (body) {
      body.enable = false;
    }

    const startX = sprite.x;
    const startY = sprite.y;
    const baseScaleX = sprite.scaleX;
    const baseScaleY = sprite.scaleY;
    const swayOffsetX = Phaser.Math.Between(config.arcOffsetXMin, config.arcOffsetXMax);
    const swayOffsetY = -Phaser.Math.Between(config.arcOffsetYMin, config.arcOffsetYMax);
    const state = { t: 0 };

    this.tweens.add({
      targets: state,
      t: 1,
      duration: config.durationMs,
      ease: config.ease,
      onUpdate: () => {
        if (!this.yachtVisual) {
          this.destroyTimeBonusShadow(sprite);
          sprite.destroy();
          return;
        }

        const t = state.t;
        const endX = this.yachtVisual.x;
        const endY = this.yachtVisual.y;
        const midX = (startX + endX) * 0.5 + swayOffsetX;
        const midY = Math.min(startY, endY) + swayOffsetY;

        const ax = Phaser.Math.Linear(startX, midX, t);
        const ay = Phaser.Math.Linear(startY, midY, t);
        const bx = Phaser.Math.Linear(midX, endX, t);
        const by = Phaser.Math.Linear(midY, endY, t);

        sprite.x = Phaser.Math.Linear(ax, bx, t);
        sprite.y = Phaser.Math.Linear(ay, by, t);

        const spriteScaleFactor = Phaser.Math.Linear(config.spriteScaleStart, config.spriteScaleEnd, t);
        const spriteAlpha = Phaser.Math.Linear(config.spriteAlphaStart, config.spriteAlphaEnd, t);
        sprite.setScale(baseScaleX * spriteScaleFactor, baseScaleY * spriteScaleFactor);
        sprite.setAlpha(spriteAlpha);

        const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
        if (shadow && shadow.active) {
          const shadowYOffset = (sprite.getData("shadowYOffset") as number | undefined) ?? TIME_BONUS.shadowYOffset;
          const shadowBaseAlpha = (sprite.getData("shadowAlpha") as number | undefined) ?? TIME_BONUS.shadowAlpha;
          const shadowScaleFactor = Phaser.Math.Linear(config.shadowScaleStart, config.shadowScaleEnd, t);
          const shadowAlphaFactor = Phaser.Math.Linear(config.shadowAlphaStart, config.shadowAlphaEnd, t);
          shadow.setPosition(sprite.x, sprite.y + shadowYOffset);
          shadow.setScale(shadowScaleFactor);
          shadow.setAlpha(shadowBaseAlpha * shadowAlphaFactor);
        }
      },
      onComplete: () => {
        this.destroyTimeBonusShadow(sprite);
        sprite.destroy();
      },
    });
  }

  private collectAirBonus(sprite: Phaser.Physics.Arcade.Sprite) {
    const bonusType = (sprite.getData("bonusType") as AirBonusType | undefined) ?? "time";
    this.destroyTimeBonusShadow(sprite);
    if (bonusType === "speed") {
      if (this.speedBonusRemainingMs <= 0 || this.speedBonusLockedKmh === undefined) {
        this.speedBonusLockedKmh = this.getBaseSpeedKmhByDistance(this.distanceM) * SPEED_BONUS_CONFIG.speedMultiplier;
      }
      this.speedBonusRemainingMs = SPEED_BONUS_CONFIG.effectDurationMs;
      this.speedBonusDecayActive = false;
      this.playYachtSpeedMotion("accel");
      this.collectFuel(sprite, "speedBonus");
      return;
    }

    this.remainingTimeMs += RUN_TIMER.bonusMs;
    this.updateTimerHud();
    this.collectFuel(sprite, "timeBonus");
  }

  private collectCoin(sprite: Phaser.Physics.Arcade.Sprite) {
    this.coinsCollected += 1;
    this.updateCoinsHud();
    this.collectFuel(sprite, "timeBonus");
  }

  private destroyTimeBonusShadow(sprite: Phaser.Physics.Arcade.Sprite) {
    const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
    if (shadow) {
      shadow.destroy();
      sprite.setData("shadow", undefined);
    }
  }

  private stopCoinRewardAnimations() {
    // kept for compatibility with existing run-end flow
  }

  private formatTimeMMSS(ms: number) {
    const seconds = ms <= 0 ? 0 : Math.ceil(ms / 1000);
    const minutesPart = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;
    return `${minutesPart.toString().padStart(2, "0")}:${secondsPart.toString().padStart(2, "0")}`;
  }

  private updateTimerHud() {
    if (!this.timeText) {
      return;
    }
    this.timeText.setText(this.formatTimeMMSS(this.remainingTimeMs));
  }

  private getBaseFallSpeedByKmh(speedKmh: number) {
    return FALL_SPEED.base + speedKmh * FALL_SPEED.perKmh;
  }

  private ensureObjectCollisionId(sprite: Phaser.Physics.Arcade.Sprite) {
    const existing = sprite.getData("collisionId") as number | undefined;
    if (existing !== undefined) {
      return existing;
    }
    this.collisionIdCounter += 1;
    sprite.setData("collisionId", this.collisionIdCounter);
    return this.collisionIdCounter;
  }

  private getCollisionPairKey(a: Phaser.Physics.Arcade.Sprite, b: Phaser.Physics.Arcade.Sprite) {
    const aId = this.ensureObjectCollisionId(a);
    const bId = this.ensureObjectCollisionId(b);
    return aId < bId ? `${aId}:${bId}` : `${bId}:${aId}`;
  }

  private pruneOldCollisionMaps() {
    if (this.collisionPairLastHit.size > 512) {
      const cutoff = this.time.now - 2000;
      this.collisionPairLastHit.forEach((value, key) => {
        if (value < cutoff) {
          this.collisionPairLastHit.delete(key);
        }
      });
    }

    if (this.solidDamageLastHit.size > 512) {
      const cutoff = this.time.now - 3000;
      this.solidDamageLastHit.forEach((value, key) => {
        if (value < cutoff) {
          this.solidDamageLastHit.delete(key);
        }
      });
    }

    if (this.buoyCollisionPairLastHit.size > 512) {
      const cutoff = this.time.now - 2000;
      this.buoyCollisionPairLastHit.forEach((value, key) => {
        if (value < cutoff) {
          this.buoyCollisionPairLastHit.delete(key);
        }
      });
    }
  }

  private startPointerControlWithPointer(pointer: Phaser.Input.Pointer) {
    const platform = this.resolveControlPlatformForPointer(pointer);
    this.pointerControlActive = true;
    this.pointerControlId = pointer.id;
    this.activeControlPlatform = platform;
    this.updateControlBoundsForPlatform(platform);
    this.pointerLastX = pointer.x;
    this.pointerLastY = pointer.y;
    this.pointerFrameDeltaX = 0;
    this.pointerFrameDeltaY = 0;
  }

  private tryStartShieldTapCandidate(pointer: Phaser.Input.Pointer) {
    if (!this.isShieldButtonTapEligible() || !this.isPointerInsideShieldButton(pointer)) {
      return false;
    }

    this.shieldTapCandidate = {
      pointerId: pointer.id,
      startX: pointer.x,
      startY: pointer.y,
      startAtMs: this.time.now,
    };
    return true;
  }

  private tryPromoteShieldTapCandidateToControl(pointer: Phaser.Input.Pointer) {
    const candidate = this.shieldTapCandidate;
    if (!candidate || candidate.pointerId !== pointer.id) {
      return false;
    }

    const maxTapMove = Math.max(0, ASSET_SHIELD_CONFIG.tapGesture.maxTapMovePx);
    const maxTapDuration = Math.max(1, ASSET_SHIELD_CONFIG.tapGesture.maxTapDurationMs);
    const movedPx = Phaser.Math.Distance.Between(candidate.startX, candidate.startY, pointer.x, pointer.y);
    const elapsedMs = this.time.now - candidate.startAtMs;
    const promoteToControl = movedPx > maxTapMove || elapsedMs > maxTapDuration;
    if (!promoteToControl) {
      return true;
    }

    this.shieldTapCandidate = undefined;
    if (!this.pointerControlActive || this.pointerControlId === pointer.id) {
      this.startPointerControlWithPointer(pointer);
    }
    return false;
  }

  private tryCompleteShieldTapCandidate(pointer: Phaser.Input.Pointer) {
    const candidate = this.shieldTapCandidate;
    if (!candidate || candidate.pointerId !== pointer.id) {
      return false;
    }

    this.shieldTapCandidate = undefined;
    const maxTapMove = Math.max(0, ASSET_SHIELD_CONFIG.tapGesture.maxTapMovePx);
    const maxTapDuration = Math.max(1, ASSET_SHIELD_CONFIG.tapGesture.maxTapDurationMs);
    const movedPx = Phaser.Math.Distance.Between(candidate.startX, candidate.startY, pointer.x, pointer.y);
    const elapsedMs = this.time.now - candidate.startAtMs;
    const isTap = movedPx <= maxTapMove && elapsedMs <= maxTapDuration;
    if (!isTap) {
      return true;
    }

    const nowMs = this.time.now;
    const debounceMs = Math.max(0, ASSET_SHIELD_CONFIG.tapGesture.tapDebounceMs);
    const cooldownMs = Math.max(0, ASSET_SHIELD_CONFIG.tapGesture.tapCooldownMs);
    if (nowMs - this.shieldButtonLastTapAtMs < Math.max(debounceMs, cooldownMs)) {
      return true;
    }
    this.shieldButtonLastTapAtMs = nowMs;
    this.onShieldButtonTap();
    return true;
  }

  private isPointerInsideShieldButton(pointer: Phaser.Input.Pointer) {
    if (!this.shieldButtonCircle) {
      return false;
    }
    const radius = this.shieldButtonCircle.radius * this.shieldButtonCircle.scaleX;
    return Phaser.Math.Distance.Between(pointer.x, pointer.y, this.shieldButtonCircle.x, this.shieldButtonCircle.y) <= radius;
  }

  private isShieldButtonTapEligible() {
    if (!ASSET_SHIELD_CONFIG.enable) {
      return false;
    }
    return this.shieldButtonState === "ready" || this.shieldButtonState === "active";
  }

  private onShieldButtonTap() {
    if (!ASSET_SHIELD_CONFIG.enable) {
      return;
    }
    if (this.shieldActive) {
      if (ASSET_SHIELD_CONFIG.activation.allowManualStop) {
        this.deactivateShield("manual_stop");
      }
      return;
    }

    if (this.assetsValue < ASSET_SHIELD_CONFIG.activation.fuelReadyThreshold) {
      this.pulseShieldButtonRejectedTap();
      return;
    }

    this.activateShield();
  }

  private activateShield() {
    if (!ASSET_SHIELD_CONFIG.enable || this.shieldActive) {
      return;
    }
    if (ASSET_SHIELD_CONFIG.activation.manualOnly && this.shieldButtonState !== "ready") {
      return;
    }

    this.shieldActive = true;
    this.shieldRemainingMs = ASSET_SHIELD_CONFIG.runtime.durationMs;
    this.endRedHitEffects();
    this.stopGreenHitFeedback();
    this.playShieldVisualEnter();
    this.startShieldShipBlink();
    this.updateShieldButtonState();
  }

  private deactivateShield(_reason: "manual_stop" | "timeout" | "fuel") {
    if (!this.shieldActive) {
      return;
    }
    this.shieldActive = false;
    this.shieldRemainingMs = 0;
    this.stopShieldShipBlink();
    this.playShieldVisualExit();
    this.updateShieldButtonState();
  }

  private refreshShieldDurationByPickup(source: "moneyUp" | "dynamicUp") {
    if (!this.shieldActive) {
      return;
    }
    if (source === "moneyUp" && !ASSET_SHIELD_CONFIG.refresh.resetOnMoneyUp) {
      return;
    }
    if (source === "dynamicUp" && !ASSET_SHIELD_CONFIG.refresh.resetOnDynamicUp) {
      return;
    }
    if (ASSET_SHIELD_CONFIG.refresh.stacking) {
      this.shieldRemainingMs += ASSET_SHIELD_CONFIG.runtime.durationMs;
      return;
    }
    this.shieldRemainingMs = ASSET_SHIELD_CONFIG.runtime.durationMs;
  }

  private updateShieldRuntime(deltaMs: number, deltaSec: number) {
    if (!ASSET_SHIELD_CONFIG.enable || !this.shieldActive) {
      return;
    }

    if (ASSET_SHIELD_CONFIG.runtime.timerEnabled) {
      this.shieldRemainingMs = Math.max(0, this.shieldRemainingMs - deltaMs);
      if (this.shieldRemainingMs <= 0) {
        this.deactivateShield("timeout");
        return;
      }
    }

    if (ASSET_SHIELD_CONFIG.runtime.drainEnabled) {
      const minFuelWhileActive = Phaser.Math.Clamp(ASSET_SHIELD_CONFIG.runtime.minFuelWhileActive, 0, 1);
      const nextFuel = this.assetsValue - ASSET_SHIELD_CONFIG.runtime.drainPerSec * deltaSec;
      if (nextFuel <= minFuelWhileActive) {
        this.assetsValue = this.assetsValue > minFuelWhileActive ? minFuelWhileActive : Math.max(0, this.assetsValue);
        this.deactivateShield("fuel");
        return;
      }
      this.assetsValue = Math.max(0, nextFuel);
    }

    if (ASSET_SHIELD_CONFIG.runtime.autoStopOnFuelEmpty && this.assetsValue <= 0) {
      this.deactivateShield("fuel");
      return;
    }

    if (
      ASSET_SHIELD_CONFIG.runtime.autoStopOnFuelBelowReadyThreshold &&
      this.assetsValue < ASSET_SHIELD_CONFIG.activation.fuelReadyThreshold
    ) {
      this.deactivateShield("fuel");
      return;
    }

    this.applyShieldMagnetForces(deltaSec);
  }

  private applyMineMagnetForces(deltaSec: number) {
    if (!MINE_CONFIG.magnet.enabled || !MINE_CONFIG.magnet.attractEnabled || !this.yachtBody) {
      return;
    }

    const body = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    const anchorX = (body ? body.center.x : this.yachtBody.x) + MINE_CONFIG.magnet.centerOffsetX;
    const anchorY = (body ? body.center.y : this.yachtBody.y) + MINE_CONFIG.magnet.centerOffsetY;

    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active) {
        return;
      }
      if (!MINE_CONFIG.magnet.allowWhileCollecting && sprite.getData("collecting")) {
        return;
      }
      const hazardType = sprite.getData("hazardType") as HazardType | undefined;
      if (hazardType !== "mine") {
        return;
      }

      if (MINE_CONFIG.magnet.updateCooldownMs > 0) {
        const lastTick = (sprite.getData("mineMagnetLastTickAt") as number | undefined) ?? Number.NEGATIVE_INFINITY;
        if (this.time.now - lastTick < MINE_CONFIG.magnet.updateCooldownMs) {
          return;
        }
        sprite.setData("mineMagnetLastTickAt", this.time.now);
      }

      const mineBody = sprite.body as Phaser.Physics.Arcade.Body | undefined;
      const centerX = mineBody ? mineBody.center.x : sprite.x;
      const centerY = mineBody ? mineBody.center.y : sprite.y;
      const dx = centerX - anchorX;
      const dy = centerY - anchorY;
      const distance = Math.hypot(dx, dy);
      if (distance <= MINE_CONFIG.magnet.minDistancePx || distance > MINE_CONFIG.magnet.attractRadiusPx) {
        return;
      }

      const normalizedDistance = Phaser.Math.Clamp(distance / MINE_CONFIG.magnet.attractRadiusPx, 0, 1);
      const falloff = Math.pow(
        Math.max(0, 1 - normalizedDistance),
        Math.max(0.05, MINE_CONFIG.magnet.attractFalloffPower),
      );
      const shieldScale = this.shieldActive ? MINE_CONFIG.magnet.impulseScaleWhenShieldActive : 1;
      const impulse = MINE_CONFIG.magnet.attractForcePxPerSec * falloff * deltaSec * shieldScale;
      if (impulse <= 0) {
        return;
      }

      const nx = -dx / distance;
      const ny = -dy / distance;
      const pushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
      const pushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
      const maxPush = Math.max(10, MINE_CONFIG.magnet.maxPushSpeedPxPerSec);
      const nextPushVx = Phaser.Math.Clamp(
        pushVx + nx * impulse * MINE_CONFIG.magnet.axisFactorX,
        -maxPush,
        maxPush,
      );
      const nextPushVy = Phaser.Math.Clamp(
        pushVy + ny * impulse * MINE_CONFIG.magnet.axisFactorY,
        -maxPush,
        maxPush,
      );

      sprite.setData("pushVx", nextPushVx);
      sprite.setData("pushVy", nextPushVy);
    });
  }

  private applyShieldMagnetForces(deltaSec: number) {
    if (!this.yachtBody) {
      return;
    }

    const body = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    const originX = body ? body.center.x : this.yachtBody.x;
    const originY = body ? body.center.y : this.yachtBody.y;
    const magnetCfg = ASSET_SHIELD_CONFIG.magnet;

    if (magnetCfg.attractEnabled) {
      this.moneyUps.children.each((child) => {
        const sprite = child as Phaser.Physics.Arcade.Sprite;
        if (!sprite.active || sprite.getData("collecting")) {
          return;
        }
        this.applyShieldMagnetForceToSprite(
          sprite,
          originX,
          originY,
          magnetCfg.attractRadiusPx,
          magnetCfg.attractForcePxPerSec,
          magnetCfg.attractFalloffPower,
          "attract",
          deltaSec,
        );
      });
    }

    this.hazards.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      const hazardType = (sprite.getData("hazardType") as HazardType | undefined) ?? "mine";
      if (hazardType === "moneyDown" && magnetCfg.repelEnabled) {
        this.applyShieldMagnetForceToSprite(
          sprite,
          originX,
          originY,
          magnetCfg.repelRadiusPx,
          magnetCfg.repelForcePxPerSec,
          magnetCfg.repelFalloffPower,
          "repel",
          deltaSec,
        );
        return;
      }
      if (hazardType !== "dynamicBuoy") {
        return;
      }
      const dynamicState = this.getDynamicBuoyCollisionState(sprite);
      if (dynamicState === "up" && magnetCfg.attractEnabled) {
        this.applyShieldMagnetForceToSprite(
          sprite,
          originX,
          originY,
          magnetCfg.attractRadiusPx,
          magnetCfg.attractForcePxPerSec,
          magnetCfg.attractFalloffPower,
          "attract",
          deltaSec,
        );
        return;
      }
      if (dynamicState === "down" && magnetCfg.repelEnabled) {
        this.applyShieldMagnetForceToSprite(
          sprite,
          originX,
          originY,
          magnetCfg.repelRadiusPx,
          magnetCfg.repelForcePxPerSec,
          magnetCfg.repelFalloffPower,
          "repel",
          deltaSec,
        );
      }
    });
  }

  private applyShieldMagnetForceToSprite(
    sprite: Phaser.Physics.Arcade.Sprite,
    originX: number,
    originY: number,
    radiusPx: number,
    forcePxPerSec: number,
    falloffPower: number,
    mode: "attract" | "repel",
    deltaSec: number,
  ) {
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    const centerX = body ? body.center.x : sprite.x;
    const centerY = body ? body.center.y : sprite.y;
    const dx = centerX - originX;
    const dy = centerY - originY;
    const distance = Math.hypot(dx, dy);
    if (distance <= 1 || distance > radiusPx) {
      return;
    }

    const falloffBase = 1 - distance / radiusPx;
    const falloff = Math.pow(Math.max(0, falloffBase), Math.max(0.05, falloffPower));
    const directionSign = mode === "attract" ? -1 : 1;
    const nx = (dx / distance) * directionSign;
    const ny = (dy / distance) * directionSign;
    const impulse = forcePxPerSec * falloff * deltaSec;

    const maxPushSpeed = Math.max(10, ASSET_SHIELD_CONFIG.magnet.maxPushSpeedPxPerSec);
    const currentPushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
    const currentPushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
    const nextPushVx = Phaser.Math.Clamp(currentPushVx + nx * impulse, -maxPushSpeed, maxPushSpeed);
    const nextPushVy = Phaser.Math.Clamp(currentPushVy + ny * impulse, -maxPushSpeed, maxPushSpeed);
    sprite.setData("pushVx", nextPushVx);
    sprite.setData("pushVy", nextPushVy);
  }

  private isShieldInvulnerabilityActiveForHazard(hazardKey: ShieldHazardKey) {
    if (!ASSET_SHIELD_CONFIG.enable || !this.shieldActive) {
      return false;
    }
    if (!ASSET_SHIELD_CONFIG.invulnerability.enabled) {
      return false;
    }
    return ASSET_SHIELD_CONFIG.invulnerability.affectedHazards.includes(hazardKey);
  }

  private applyShieldContactPushByType(sprite: Phaser.Physics.Arcade.Sprite, hazardKey: ShieldHazardKey) {
    if (!ASSET_SHIELD_CONFIG.invulnerability.contactPushEnabled || !this.yachtBody) {
      return;
    }

    const cfg = ASSET_SHIELD_CONFIG.invulnerability.contactPushByType[hazardKey];
    const now = this.time.now;
    const cooldownKey = `shieldPushLastAt:${hazardKey}`;
    const last = (sprite.getData(cooldownKey) as number | undefined) ?? Number.NEGATIVE_INFINITY;
    if (now - last < cfg.cooldownMs) {
      return;
    }
    sprite.setData(cooldownKey, now);

    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    const yachtBody = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body || !yachtBody) {
      return;
    }

    const dx = body.center.x - yachtBody.center.x;
    const dy = body.center.y - yachtBody.center.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = dx / len;
    const ny = dy / len;
    const impulse = cfg.impulsePxPerSec;

    const pushVx = ((sprite.getData("pushVx") as number | undefined) ?? 0) + nx * impulse;
    const pushVyBase = ((sprite.getData("pushVy") as number | undefined) ?? 0) + ny * impulse * cfg.verticalImpulseFactor;
    const pushVy = Phaser.Math.Clamp(pushVyBase, -cfg.maxVerticalPushPxPerSec, cfg.maxVerticalPushPxPerSec);

    sprite.setData("pushVx", pushVx);
    sprite.setData("pushVy", pushVy);
    sprite.setData("pushX", ((sprite.getData("pushX") as number | undefined) ?? 0) + nx * cfg.separationPx);
  }

  private startShieldShipBlink() {
    this.stopShieldShipBlink();
    if (!this.yachtVisual || !ASSET_SHIELD_CONFIG.shipBlink.enabled) {
      return;
    }
    const cfg = ASSET_SHIELD_CONFIG.shipBlink;
    const fromColor = new Phaser.Display.Color(255, 255, 255);
    const toColor = Phaser.Display.Color.ValueToColor(cfg.tintColor);
    const blendState = { t: 0 };
    this.yachtVisual.setAlpha(1);
    this.shieldShipBlinkTween = this.tweens.add({
      targets: blendState,
      t: cfg.tintStrength,
      duration: cfg.blinkHalfCycleMs,
      ease: cfg.blinkEase,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        if (!this.yachtVisual) {
          return;
        }
        const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(fromColor, toColor, 100, Math.round(blendState.t * 100));
        const tint = Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
        this.yachtVisual.setTint(tint);
        this.yachtVisual.setAlpha(Phaser.Math.Linear(1, cfg.blinkAlphaMin, blendState.t));
      },
    });
  }

  private stopShieldShipBlink() {
    this.shieldShipBlinkTween?.stop();
    this.shieldShipBlinkTween = undefined;
    if (this.yachtVisual) {
      this.yachtVisual.clearTint();
      this.yachtVisual.setAlpha(1);
    }
  }

  private createShieldBezierEase() {
    const bezier = ASSET_SHIELD_CONFIG.visual.bezier;
    return (progress: number) => {
      const x = Phaser.Math.Clamp(progress, 0, 1);
      return this.solveCubicBezierYForX(x, bezier.x1, bezier.y1, bezier.x2, bezier.y2);
    };
  }

  private solveCubicBezierYForX(x: number, x1: number, y1: number, x2: number, y2: number) {
    let low = 0;
    let high = 1;
    let t = x;
    for (let i = 0; i < 12; i += 1) {
      t = (low + high) * 0.5;
      const curveX = this.cubicBezierPoint(t, x1, x2);
      if (curveX < x) {
        low = t;
      } else {
        high = t;
      }
    }
    return this.cubicBezierPoint(t, y1, y2);
  }

  private cubicBezierPoint(t: number, p1: number, p2: number) {
    const inv = 1 - t;
    return 3 * inv * inv * t * p1 + 3 * inv * t * t * p2 + t * t * t;
  }

  private setupInput() {
    this.input.off("pointerdown", this.onPointerDown);
    this.input.off("pointerup", this.onPointerUp);
    this.input.off("pointerupoutside", this.onPointerUp);
    this.input.off("pointermove", this.onPointerMove);
    this.input.on("pointerdown", this.onPointerDown);
    this.input.on("pointerup", this.onPointerUp);
    this.input.on("pointerupoutside", this.onPointerUp);
    this.input.on("pointermove", this.onPointerMove);
  }

  private isPointerControlPointer(pointer: Phaser.Input.Pointer) {
    return this.pointerControlActive && this.pointerControlId === pointer.id;
  }

  private resolveControlPlatformForPointer(pointer: Phaser.Input.Pointer): ControlPlatform {
    if (RELATIVE_TOUCH_ROUTING.platformSource === "manual") {
      return RELATIVE_TOUCH_ROUTING.manualPlatform;
    }

    if (pointer.wasTouch) {
      return "mobile";
    }

    const eventPointerType = (pointer.event as { pointerType?: string } | undefined)?.pointerType;
    return eventPointerType === "touch" ? "mobile" : "desktop";
  }

  private getControlProfileForPlatform(platform: ControlPlatform) {
    return RELATIVE_TOUCH_CONTROL[platform];
  }

  private updateControlBoundsForPlatform(platform: ControlPlatform) {
    const controlProfile = this.getControlProfileForPlatform(platform);
    const { width, height } = this.scale;
    this.controlMinX = controlProfile.minXPaddingPx;
    this.controlMaxX = width - controlProfile.maxXPaddingPx;
    this.controlMinY = controlProfile.minYPaddingPx;
    this.controlMaxY = height - controlProfile.maxYPaddingPx;
    this.desiredTargetX = Phaser.Math.Clamp(this.desiredTargetX, this.controlMinX, this.controlMaxX);
    this.desiredTargetY = Phaser.Math.Clamp(this.desiredTargetY, this.controlMinY, this.controlMaxY);
    this.targetX = Phaser.Math.Clamp(this.targetX, this.controlMinX, this.controlMaxX);
    this.targetY = Phaser.Math.Clamp(this.targetY, this.controlMinY, this.controlMaxY);
  }

  private updatePointerFrameDelta(pointer: Phaser.Input.Pointer) {
    const deltaXRaw = pointer.x - this.pointerLastX;
    const deltaYRaw = pointer.y - this.pointerLastY;
    this.pointerLastX = pointer.x;
    this.pointerLastY = pointer.y;
    this.applyPointerFrameDelta(deltaXRaw, deltaYRaw);
  }

  private applyPointerFrameDelta(deltaXRaw: number, deltaYRaw: number) {
    const controlProfile = this.getControlProfileForPlatform(this.activeControlPlatform);
    const deltaX = Phaser.Math.Clamp(
      deltaXRaw,
      -controlProfile.maxDeltaXPerEventPx,
      controlProfile.maxDeltaXPerEventPx,
    );
    const deltaY = Phaser.Math.Clamp(
      deltaYRaw,
      -controlProfile.maxDeltaYPerEventPx,
      controlProfile.maxDeltaYPerEventPx,
    );
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (magnitude < controlProfile.deadZonePx) {
      return;
    }

    this.pointerFrameDeltaX += deltaX;
    this.pointerFrameDeltaY += deltaY;
  }

  private getSmoothedAxisValue(current: number, target: number, lerpT: number, snapDistancePx: number) {
    if (Math.abs(target - current) <= snapDistancePx) {
      return target;
    }
    return Phaser.Math.Linear(current, target, lerpT);
  }

  private resetPointerControlState() {
    this.pointerControlActive = false;
    this.pointerControlId = undefined;
    this.activeControlPlatform = RELATIVE_TOUCH_ROUTING.manualPlatform;
    this.updateControlBoundsForPlatform(this.activeControlPlatform);
    this.pointerLastX = 0;
    this.pointerLastY = 0;
    this.pointerFrameDeltaX = 0;
    this.pointerFrameDeltaY = 0;
    if (this.yachtBody) {
      this.targetX = this.yachtBody.x;
      this.targetY = this.yachtBody.y - this.yMotionOffsetPx;
      this.desiredTargetX = this.targetX;
      this.desiredTargetY = this.targetY;
    }
  }

  private playYachtSpeedMotion(type: "accel" | "brake") {
    const isAccel = type === "accel";
    const offsetPx = isAccel ? YACHT_SPEED_Y_ANIM.accelOffsetPx : YACHT_SPEED_Y_ANIM.brakeOffsetPx;
    const outDurationMs = isAccel ? YACHT_SPEED_Y_ANIM.accelDurationMs : YACHT_SPEED_Y_ANIM.brakeDurationMs;
    const returnDurationMs = isAccel ? YACHT_SPEED_Y_ANIM.accelReturnMs : YACHT_SPEED_Y_ANIM.brakeReturnMs;

    this.stopYachtSpeedMotionTweens();
    this.yachtSpeedMotionOutTween = this.tweens.add({
      targets: this,
      yMotionOffsetPx: offsetPx,
      duration: outDurationMs,
      ease: YACHT_SPEED_Y_ANIM.ease,
      onComplete: () => {
        this.yachtSpeedMotionOutTween = undefined;
        this.yachtSpeedMotionReturnTween = this.tweens.add({
          targets: this,
          yMotionOffsetPx: 0,
          duration: returnDurationMs,
          ease: YACHT_SPEED_Y_ANIM.ease,
          onComplete: () => {
            this.yachtSpeedMotionReturnTween = undefined;
          },
        });
      },
    });
  }

  private stopYachtSpeedMotionTweens() {
    this.yachtSpeedMotionOutTween?.stop();
    this.yachtSpeedMotionReturnTween?.stop();
    this.yachtSpeedMotionOutTween = undefined;
    this.yachtSpeedMotionReturnTween = undefined;
  }

  private moveTowardValue(current: number, target: number, maxDelta: number) {
    if (maxDelta <= 0 || current === target) {
      return current;
    }
    if (current < target) {
      return Math.min(current + maxDelta, target);
    }
    return Math.max(current - maxDelta, target);
  }

  private getBaseSpeedKmhByDistance(distanceM: number) {
    const clampedDistance = Phaser.Math.Clamp(distanceM, 0, RUN_SPEED_RAMP.maxAtMeters);
    const steps = Math.floor(clampedDistance / RUN_SPEED_RAMP.everyMeters);
    const speed = RUN_SPEED_RAMP.startKmh + steps * RUN_SPEED_RAMP.addKmhPerStep;
    return Math.min(RUN_SPEED_RAMP.maxKmh, speed);
  }

  private getInitialRunSpeedKmh() {
    return Math.max(0, TUNING.SPEED_START_KMH - RUN_START_SPEED.startDropKmh);
  }

  private createAssetsBar() {
    this.assetsBarGraphics?.destroy();
    this.assetsBarGraphics = this.add.graphics();
    this.assetsBarGraphics.setDepth(ASSETS_BAR_UI.depth);
  }

  private getAssetsProgress(fuel: number) {
    return Phaser.Math.Clamp(fuel, 0, 1);
  }

  private updateAssetsBar(fuel: number) {
    if (!this.assetsBarGraphics) {
      return;
    }

    const progress = this.getAssetsProgress(fuel);
    let x: number;
    let y: number;

    if (ASSETS_BAR_UI.anchorFromVisualBounds && this.yachtVisual) {
      const bounds = this.yachtVisual.getBounds();
      x = bounds.x + ASSETS_BAR_UI.anchorOffsetX;
      y = bounds.y + ASSETS_BAR_UI.anchorOffsetY;
    } else if (this.yachtBody) {
      x = this.yachtBody.x + ASSETS_BAR_UI.offsetX;
      y = this.yachtBody.y + ASSETS_BAR_UI.offsetY;
    } else {
      return;
    }

    const width = ASSETS_BAR_UI.width;
    const height = ASSETS_BAR_UI.height;
    const borderThickness = ASSETS_BAR_UI.borderThickness;
    const trackInset = borderThickness + ASSETS_BAR_UI.trackPadding;
    const trackX = x + trackInset;
    const trackY = y + trackInset;
    const trackWidth = Math.max(1, width - trackInset * 2);
    const trackHeight = Math.max(1, height - trackInset * 2);
    const trackRadius = Math.max(1, ASSETS_BAR_UI.outerRadius - trackInset);

    this.assetsBarGraphics.clear();

    this.assetsBarGraphics.fillStyle(ASSETS_BAR_UI.frameFillColor, 1);
    this.assetsBarGraphics.fillRoundedRect(x, y, width, height, ASSETS_BAR_UI.outerRadius);

    this.assetsBarGraphics.lineStyle(borderThickness, ASSETS_BAR_UI.borderBottomColor, 1);
    this.assetsBarGraphics.strokeRoundedRect(x, y, width, height, ASSETS_BAR_UI.outerRadius);

    this.assetsBarGraphics.fillStyle(ASSETS_BAR_UI.borderTopColor, 0.35);
    this.assetsBarGraphics.fillRoundedRect(x, y, width, height * 0.5, ASSETS_BAR_UI.outerRadius);

    this.assetsBarGraphics.fillStyle(ASSETS_BAR_UI.trackColor, 1);
    this.assetsBarGraphics.fillRoundedRect(trackX, trackY, trackWidth, trackHeight, trackRadius);

    const fillWidth = trackWidth * progress;
    if (fillWidth <= 0) {
      return;
    }

    const fillColor = this.getAssetsBarFillColor(progress);
    this.assetsBarGraphics.fillStyle(fillColor, 1);
    if (fillWidth >= trackRadius * 2) {
      this.assetsBarGraphics.fillRoundedRect(trackX, trackY, fillWidth, trackHeight, trackRadius);
    } else {
      this.assetsBarGraphics.fillRect(trackX, trackY, fillWidth, trackHeight);
    }
  }

  private getAssetsBarFillColor(progress: number) {
    const p = Phaser.Math.Clamp(progress, 0, 1);
    const midColor = Phaser.Display.Color.ValueToColor(ASSETS_BAR_UI.fillColorMid);

    if (p >= 0.5) {
      const t = (p - 0.5) / 0.5;
      const highColor = Phaser.Display.Color.ValueToColor(ASSETS_BAR_UI.fillColorHigh);
      const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(midColor, highColor, 100, Math.round(t * 100));
      return Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
    }

    const t = p / 0.5;
    const lowColor = Phaser.Display.Color.ValueToColor(ASSETS_BAR_UI.fillColorLow);
    const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(lowColor, midColor, 100, Math.round(t * 100));
    return Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
  }

  private updateYachtStageTextureByAssets(fuel: number) {
    if (!this.yachtVisual) {
      return;
    }

    const progressPercent = this.getAssetsProgress(fuel) * 100;
    const nextTexture = this.getShipTextureKeyByAssets(progressPercent);
    if (this.yachtVisual.texture.key !== nextTexture) {
      this.yachtVisual.setTexture(nextTexture);
      this.applyYachtVisualSizing();
    }
  }

  private getShipTextureKeyByAssets(progressPercent: number) {
    const percent = Phaser.Math.Clamp(progressPercent, 0, 100);
    const stage = SHIP_ASSET_STAGES.find((item) => percent <= item.maxPercent);
    return stage ? stage.textureKey : SHIP_ASSET_STAGES[SHIP_ASSET_STAGES.length - 1].textureKey;
  }

  private createRedHitOverlay(width: number, height: number) {
    this.redOverlay?.destroy();
    this.redOverlay = this.add.rectangle(
      width * 0.5,
      height * 0.5,
      width,
      height,
      RED_HIT_OVERLAY_EFFECT.color,
      RED_HIT_OVERLAY_EFFECT.alpha,
    );
    this.redOverlay.setScrollFactor(0);
    this.redOverlay.setDepth(RED_HIT_OVERLAY_EFFECT.depth);
    this.redOverlay.setVisible(false);
    this.redOverlay.setAlpha(0);
  }

  private triggerRedHitEffects() {
    this.redInvulActive = true;
    this.redInvulTimer?.remove(false);
    this.redInvulTimer = this.time.delayedCall(RED_HIT_INVULNERABILITY.durationMs, () => {
      this.endRedInvulnerabilityEffects();
    });

    this.triggerRedOverlayEffect();

    this.redShipBlinkTween?.stop();
    if (this.yachtVisual) {
      this.yachtVisual.setAlpha(1);
      this.redShipBlinkTween = this.tweens.add({
        targets: this.yachtVisual,
        alpha: RED_HIT_INVULNERABILITY.blinkAlphaMin,
        duration: RED_HIT_INVULNERABILITY.blinkHalfCycleMs,
        ease: RED_HIT_INVULNERABILITY.blinkEase,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private triggerRedOverlayEffect() {
    if (!RED_HIT_OVERLAY_EFFECT.enabled) {
      this.endRedOverlayEffect();
      return;
    }

    this.redOverlayTimer?.remove(false);
    this.redOverlayTimer = this.time.delayedCall(RED_HIT_OVERLAY_EFFECT.durationMs, () => {
      this.endRedOverlayEffect();
    });

    if (this.redOverlay) {
      this.redOverlay.setVisible(true);
      this.redOverlay.setAlpha(RED_HIT_OVERLAY_EFFECT.alpha);
    }
  }

  private endRedInvulnerabilityEffects() {
    this.redInvulActive = false;
    this.redInvulTimer?.remove(false);
    this.redInvulTimer = undefined;

    this.redShipBlinkTween?.stop();
    this.redShipBlinkTween = undefined;
    if (this.yachtVisual) {
      this.yachtVisual.setAlpha(1);
    }
  }

  private endRedOverlayEffect() {
    this.redOverlayTimer?.remove(false);
    this.redOverlayTimer = undefined;

    if (this.redOverlay) {
      this.redOverlay.setVisible(false);
      this.redOverlay.setAlpha(0);
    }
  }

  private endRedHitEffects() {
    this.endRedInvulnerabilityEffects();
    this.endRedOverlayEffect();
  }

  private triggerGreenHitFeedback() {
    if (!this.yachtVisual) {
      return;
    }

    if (this.shieldActive && ASSET_SHIELD_CONFIG.shipBlink.enabled) {
      return;
    }

    this.greenShipTintTween?.stop();
    this.greenShipTintTween = undefined;

    const blendState = { t: 0 };
    const fromColor = new Phaser.Display.Color(255, 255, 255);
    const toColor = Phaser.Display.Color.ValueToColor(GREEN_HIT_FEEDBACK.tintColor);
    const halfCycle = Math.max(1, GREEN_HIT_FEEDBACK.blinkHalfCycleMs);
    const repeats = Math.max(0, Math.round(GREEN_HIT_FEEDBACK.durationMs / (halfCycle * 2)) - 1);

    this.yachtVisual.clearTint();
    this.greenShipTintTween = this.tweens.add({
      targets: blendState,
      t: 1,
      duration: halfCycle,
      ease: GREEN_HIT_FEEDBACK.blinkEase,
      yoyo: true,
      repeat: repeats,
      onUpdate: () => {
        if (!this.yachtVisual) {
          return;
        }
        const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(fromColor, toColor, 100, Math.round(blendState.t * 100));
        const tint = Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
        this.yachtVisual.setTint(tint);
      },
      onComplete: () => {
        this.greenShipTintTween = undefined;
        if (this.yachtVisual) {
          this.yachtVisual.clearTint();
        }
      },
    });
  }

  private stopGreenHitFeedback() {
    this.greenShipTintTween?.stop();
    this.greenShipTintTween = undefined;
    this.yachtVisual?.clearTint();
  }

  private updateCoinsHud() {
    if (!this.coinsText) {
      return;
    }
    this.coinsText.setText(`${this.coinsCollected}`);
  }

  private updateTopProgressUi() {
    if (!this.topProgressGraphics) {
      return;
    }

    const cfg = TOP_PROGRESS_BAR_CONFIG;
    const width = this.scale.width;
    const x = width * cfg.xRatio;
    const y = cfg.y;
    const progress = Phaser.Math.Clamp(this.distanceM / LANDMARK_METERS.harbor, 0, 1);
    const fillWidth = cfg.width * progress;

    this.topProgressGraphics.clear();
    this.topProgressGraphics.fillStyle(cfg.frameColor, 1);
    this.topProgressGraphics.fillRoundedRect(x - cfg.width / 2, y, cfg.width, cfg.height, cfg.radius);
    this.topProgressGraphics.fillStyle(cfg.fillColor, 1);
    if (fillWidth > 0) {
      this.topProgressGraphics.fillRoundedRect(x - cfg.width / 2, y, fillWidth, cfg.height, cfg.radius);
    }

    if (this.topProgressShipMarker) {
      this.topProgressShipMarker.setPosition(
        x - cfg.width / 2 + fillWidth,
        y + cfg.height / 2 + cfg.markerYOffsetPx,
      );
    }
    if (this.topProgressFlag) {
      this.topProgressFlag.setPosition(x + cfg.width / 2 + cfg.flagOffsetX, y + cfg.height / 2);
    }
  }

  private updateAutoShieldState() {
    if (!ASSET_SHIELD_CONFIG.enable) {
      return;
    }

    if (!this.shieldActive && this.assetsValue >= ASSET_SHIELD_CONFIG.activation.fuelReadyThreshold) {
      this.activateShield();
      return;
    }

    if (this.shieldActive && this.assetsValue <= 0) {
      this.deactivateShield("fuel");
    }
  }

  private isPhysicsGroupUsable(
    group: Phaser.Physics.Arcade.Group | undefined
  ): group is Phaser.Physics.Arcade.Group & {
    children: Phaser.Structs.Set<Phaser.GameObjects.GameObject>;
  } {
    const candidate = group as (Phaser.Physics.Arcade.Group & {
      children?: Phaser.Structs.Set<Phaser.GameObjects.GameObject>;
    }) | undefined;
    return !!candidate?.children;
  }

  private safeClearPhysicsGroup(
    group: Phaser.Physics.Arcade.Group | undefined,
    removeFromScene = true,
    destroyChild = true
  ) {
    if (!this.isPhysicsGroupUsable(group)) {
      return;
    }
    group.clear(removeFromScene, destroyChild);
  }

  private safeEachGroupChild(
    group: Phaser.Physics.Arcade.Group | undefined,
    callback: (child: Phaser.GameObjects.GameObject) => void
  ) {
    if (!this.isPhysicsGroupUsable(group)) {
      return;
    }
    group.children.each(callback);
  }

  private finishRunSuccess(reason: SuccessReason) {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.stopCoinRewardAnimations();
    this.deactivateShield("manual_stop");
    this.endRedHitEffects();
    this.stopGreenHitFeedback();
    this.stopAllDynamicBuoyStateTimers();
    this.safeEachGroupChild(this.timeBonuses, (child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });
    this.safeEachGroupChild(this.coins, (child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });

    this.scene.start("Result", {
      distanceM: this.distanceM,
      coinsAwarded: this.coinsCollected,
      coinsLost: 0,
      reason,
    });
  }

  private finishRunOutOfTime() {
    this.finishRunFailure("out_of_time");
  }

  private finishRunFailure(reason: FailureReason) {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.stopCoinRewardAnimations();
    this.deactivateShield("manual_stop");
    this.endRedHitEffects();
    this.stopGreenHitFeedback();
    this.stopAllDynamicBuoyStateTimers();
    this.safeEachGroupChild(this.timeBonuses, (child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });
    this.safeEachGroupChild(this.coins, (child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });

    this.scene.start("Result", {
      distanceM: this.distanceM,
      coinsAwarded: this.coinsCollected,
      coinsLost: 0,
      reason: reason as ResultReason,
    });
  }

  private resetState() {
    this.isGameOver = false;
    this.stopCoinRewardAnimations();
    this.resetPointerControlState();
    this.swayTime = 0;
    this.yMotionOffsetPx = 0;
    this.stopYachtSpeedMotionTweens();
    this.deactivateShield("manual_stop");
    this.endRedHitEffects();
    this.stopGreenHitFeedback();
    this.speedKmh = this.getInitialRunSpeedKmh();
    this.distanceM = 0;
    this.assetsValue = TUNING.FUEL_START;
    this.remainingTimeMs = RUN_TIMER.initialMs;
    this.shieldButtonLastTapAtMs = Number.NEGATIVE_INFINITY;
    this.shieldTapCandidate = undefined;
    this.coinsCollected = 0;
    this.coinsScheduledTotal = 0;
    this.speedBonusRemainingMs = 0;
    this.speedBonusLockedKmh = undefined;
    this.speedBonusDecayActive = false;
    this.obstacleSlowdownUntilMs = Number.NEGATIVE_INFINITY;

    this.scheduledObjects = [];
    this.scheduledObjectCursor = 0;

    this.collisionPairLastHit.clear();
    this.buoyCollisionPairLastHit.clear();
    this.solidDamageLastHit.clear();
    this.collisionIdCounter = 0;

    this.stopAllDynamicBuoyStateTimers();
    this.safeClearPhysicsGroup(this.hazards, true, true);
    this.safeClearPhysicsGroup(this.moneyUps, true, true);
    this.safeClearPhysicsGroup(this.coins, true, true);

    this.safeEachGroupChild(this.timeBonuses, (child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });
    this.safeClearPhysicsGroup(this.timeBonuses, true, true);
    this.safeClearPhysicsGroup(this.solids, true, true);

    this.harborGate?.destroy();
    this.harborGate = undefined;

    this.yachtBody?.destroy();
    this.yachtHazardCollider?.destroy();
    this.yachtVisual?.destroy();
    this.yachtBody = undefined;
    this.yachtHazardCollider = undefined;
    this.yachtVisual = undefined;

    this.assetsBarGraphics?.destroy();
    this.assetsBarGraphics = undefined;
    this.destroyShieldUi();

    this.topProgressGraphics?.destroy();
    this.topProgressGraphics = undefined;
    this.topProgressShipMarker?.destroy();
    this.topProgressShipMarker = undefined;
    this.topProgressFlag?.destroy();
    this.topProgressFlag = undefined;
    this.coinsText?.destroy();
    this.coinsText = undefined;

    this.redOverlay?.destroy();
    this.redOverlay = undefined;

    this.timePanelGraphics?.destroy();
    this.timeText?.destroy();
    this.timePanelGraphics = undefined;
    this.timeText = undefined;

    this.input.off("pointerdown", this.onPointerDown);
    this.input.off("pointerup", this.onPointerUp);
    this.input.off("pointerupoutside", this.onPointerUp);
    this.input.off("pointermove", this.onPointerMove);
  }
}
