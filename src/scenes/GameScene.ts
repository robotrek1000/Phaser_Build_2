import Phaser from "phaser";
import {
  BONUS_SPAWN,
  BRAKING,
  BUOY_COLLISION,
  BUOY_HITBOX,
  COIN_PENDING_MILESTONES,
  DISTANCE_CHECKPOINTS,
  DYNAMIC_BUOY_STATE_ORDER,
  DYNAMIC_BUOY_STATES,
  DYNAMIC_SWAY,
  FALL_SPEED,
  FREE_CONTROL_2D,
  FUEL_SWAY,
  FUEL_VISUAL_SCALE,
  HUD_FEEDBACK,
  HUD_LAYOUT,
  IMPACT_ANIMATION,
  LANDMARK_LAYOUT,
  LANDMARK_METERS,
  OBJECT_DRIFT,
  OBJECT_SIZES,
  OBSTACLE_SWAY,
  PLAY_AREA,
  PROGRESS_BAR_NEW_KEYS,
  RUN_TIMER,
  RUN_START_SPEED,
  SPAWN_BASE_DELAYS,
  SPAWN_MULTIPLIERS,
  SPAWN_PAUSE_WINDOW_METERS,
  SPEED_BONUS_FALL_SPEED_MULTIPLIERS,
  SPEED_BONUS,
  SPEED_BONUS_SPAWN_MULTIPLIERS,
  SPEED_BONUS_TRANSITION,
  SPEED_VARIANCE,
  TIME_BONUS,
  TIME_BONUS_SPAWN_MULTIPLIERS,
  TIME_HUD,
  TUNING,
  UI_TEXT,
  WATER_SCROLL,
  YACHT_HITBOX,
  YACHT_SPEED_Y_ANIM,
  YACHT_SWAY,
  YACHT_VISUAL_OFFSET,
} from "../config/tuning";

type SuccessReason = "success_island_200" | "success_tavern_400" | "success_harbor_610";
type FailureReason = "out_of_assets" | "out_of_time";
type ResultReason = FailureReason | SuccessReason;
type LandmarkType = "island200" | "tavern400" | "harbor610";
type AirBonusType = "time" | "speed";
type DynamicBuoyStateKey = keyof typeof DYNAMIC_BUOY_STATES;
type BuoyType = "obstacle" | "fuel" | "dynamic";

type LandmarkConfig = {
  xRatio: number;
  width: number;
  height: number;
  hitboxScaleX: number;
  hitboxScaleY: number;
};

type EllipseHitboxParams = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
};

export default class GameScene extends Phaser.Scene {
  private water?: Phaser.GameObjects.TileSprite;
  private speedText?: Phaser.GameObjects.Text;
  private distanceText?: Phaser.GameObjects.Text;
  private speedIcon?: Phaser.GameObjects.Image;
  private distanceIcon?: Phaser.GameObjects.Image;
  private fuelBar?: Phaser.GameObjects.Image;
  private fuelIcon?: Phaser.GameObjects.Image;
  private progressBar?: Phaser.GameObjects.Image;
  private timeBar?: Phaser.GameObjects.Image;
  private timeText?: Phaser.GameObjects.Text;
  private progressKeys = [...PROGRESS_BAR_NEW_KEYS];
  private fuelBarKeys = ["bar-1", "bar-2", "bar-3", "bar-4", "bar-5"];

  private yachtBody?: Phaser.Physics.Arcade.Sprite;
  private yachtVisual?: Phaser.GameObjects.Sprite;
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
  private hasPointerControlInput = false;
  private yMotionOffsetPx = 0;
  private yachtSpeedMotionOutTween?: Phaser.Tweens.Tween;
  private yachtSpeedMotionReturnTween?: Phaser.Tweens.Tween;
  private swayTime = 0;

  private obstacles!: Phaser.Physics.Arcade.Group;
  private fuels!: Phaser.Physics.Arcade.Group;
  private dynamicBuoys!: Phaser.Physics.Arcade.Group;
  private timeBonuses!: Phaser.Physics.Arcade.Group;
  private landmarks!: Phaser.Physics.Arcade.Group;
  private harborGate?: Phaser.Physics.Arcade.Image;

  private obstacleTimer?: Phaser.Time.TimerEvent;
  private fuelTimer?: Phaser.Time.TimerEvent;
  private dynamicTimer?: Phaser.Time.TimerEvent;
  private bonusSpawnTimer?: Phaser.Time.TimerEvent;

  private isGameOver = false;
  private isSpawnPauseActive = false;
  private speedKmh = Math.max(0, TUNING.SPEED_START_KMH - RUN_START_SPEED.startDropKmh);
  private distanceM = 0;
  private fuel = TUNING.FUEL_START;
  private remainingTimeMs = RUN_TIMER.initialMs;
  private speedBonusRemainingMs = 0;
  private speedBonusLockedKmh?: number;
  private bonusDecayActive = false;
  private lastSpawnedBonusType?: AirBonusType;
  private sameTypeSpawnStreak = 0;
  private scheduledAirBonusType?: AirBonusType;
  private currentBuoySpawnRangeIndex = -1;
  private currentTimeBonusSpawnRangeIndex = -1;
  private currentSpeedBonusSpawnRangeIndex = -1;
  private buoyCollisionPairLastHit = new Map<string, number>();
  private buoyCollisionIdCounter = 0;

  private pendingCoins = 0;
  private progressStage = 0;
  private reachedCoinMilestones = new Set<number>();
  private spawnedLandmarks = {
    island200: false,
    tavern400: false,
    harbor610: false,
  };

  private readonly onPointerDown = (pointer: Phaser.Input.Pointer) => {
    if (this.pointerControlActive && this.pointerControlId !== pointer.id) {
      return;
    }

    const wasInactive = !this.pointerControlActive;
    this.pointerControlActive = true;
    this.pointerControlId = pointer.id;
    this.hasPointerControlInput = true;
    this.updateTargetPosition(pointer.x, pointer.y);
    if (wasInactive) {
      this.playYachtSpeedMotion("accel");
    }
  };

  private readonly onPointerUp = (pointer: Phaser.Input.Pointer) => {
    if (!this.isPointerControlPointer(pointer)) {
      return;
    }

    this.resetPointerControlState();
    if (!this.isSpeedBonusActive() && !this.bonusDecayActive) {
      this.playYachtSpeedMotion("brake");
    }
  };

  private readonly onPointerMove = (pointer: Phaser.Input.Pointer) => {
    if (!this.isPointerControlPointer(pointer)) {
      return;
    }

    this.updateTargetPosition(pointer.x, pointer.y);
  };

  constructor() {
    super("Game");
  }

  create() {
    this.resetState();
    const { width, height } = this.scale;

    this.createWaterBackground(width, height);
    this.createObjectTextures();
    this.createYachtAnimation();
    this.createHud(width, height);
    this.createYacht(width, height);
    this.setupInput();
    this.createGroups();
    this.setupCollisions();

    this.initializeSpawnRangeState();
    this.scheduleObstacleSpawn();
    this.scheduleFuelSpawn();
    this.scheduleDynamicSpawn();
    this.scheduleAirBonusSpawn();
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
      this.bonusDecayActive = true;
      this.speedBonusLockedKmh = undefined;
    }

    const baseSpeedKmh = this.getBaseSpeedKmhByDistance(this.distanceM);
    const initialRunSpeedKmh = this.getInitialRunSpeedKmh();
    const brakeFloorKmh = Math.max(0, TUNING.SPEED_START_KMH - BRAKING.minDropFromStartKmh);
    let speedTargetKmh = baseSpeedKmh;
    let speedStepKmh = BRAKING.recoverKmhPerSec * dt;

    if (speedBonusIsActive) {
      const lockedBonusSpeed =
        this.speedBonusLockedKmh ?? this.getBaseSpeedKmhByDistance(this.distanceM) * SPEED_BONUS.speedMultiplier;
      this.speedBonusLockedKmh = lockedBonusSpeed;
      speedTargetKmh = lockedBonusSpeed;
      speedStepKmh = SPEED_BONUS_TRANSITION.rampUpKmhPerSec * dt;
      this.bonusDecayActive = false;
    } else if (this.bonusDecayActive) {
      speedTargetKmh = baseSpeedKmh;
      speedStepKmh = SPEED_BONUS_TRANSITION.rampDownKmhPerSec * dt;
    } else if (this.pointerControlActive) {
      speedTargetKmh = baseSpeedKmh;
      speedStepKmh = BRAKING.recoverKmhPerSec * dt;
    } else if (this.hasPointerControlInput) {
      speedTargetKmh = brakeFloorKmh;
      speedStepKmh = BRAKING.decelKmhPerSec * dt;
    } else {
      speedTargetKmh = initialRunSpeedKmh;
      speedStepKmh = BRAKING.decelKmhPerSec * dt;
    }

    this.speedKmh = this.moveTowardValue(this.speedKmh, speedTargetKmh, speedStepKmh);
    if (this.bonusDecayActive && Math.abs(this.speedKmh - baseSpeedKmh) < 0.01) {
      this.bonusDecayActive = false;
    }

    const speedMps = (this.speedKmh * 1000) / 3600;
    this.distanceM += speedMps * dt;

    if (this.yachtBody) {
      this.yachtBody.setX(
        Phaser.Math.Linear(this.yachtBody.x, this.targetX, FREE_CONTROL_2D.positionLerpPerSecX * dt),
      );
      this.yachtBody.setY(
        Phaser.Math.Linear(this.yachtBody.y, this.targetY + this.yMotionOffsetPx, FREE_CONTROL_2D.positionLerpPerSecY * dt),
      );
    }
    this.updateSpawnTimersForDistanceRange();
    this.updateActiveBuoyAndAirFallSpeeds(dt);
    this.fuel = Math.max(0, this.fuel - dt * TUNING.FUEL_DRAIN_PER_SEC);

    if (this.fuel <= 0) {
      this.finishRunOutOfAssets();
      return;
    }

    if (this.water) {
      const extra = Math.max(0, this.speedKmh - 20) * WATER_SCROLL.extraPerKmhAfter20;
      const scrollSpeed = WATER_SCROLL.baseSpeed + this.speedKmh * WATER_SCROLL.perKmh + extra;
      this.water.tilePositionY -= delta * scrollSpeed;
    }

    this.updatePendingCoins();
    this.updateCheckpointProgress();
    this.spawnLandmarksByDistance();
    this.updateSpawnPauseState();
    this.updateLandmarkVelocities();

    this.cleanupFallingObjects();
    this.updateDriftedObjects(dt);
    this.updateTimeBonuses(dt);

    if (this.yachtBody && this.yachtVisual) {
      this.swayTime += delta / 1000;
      const swayOffset = Math.sin(this.swayTime * YACHT_SWAY.frequencyHz) * YACHT_SWAY.amplitudePx;
      this.yachtVisual.setPosition(this.yachtBody.x, this.yachtBody.y + YACHT_VISUAL_OFFSET.y + swayOffset);
    }

    if (this.speedText) {
      this.speedText.setText(`${Math.round(this.speedKmh)} км/ч`);
    }

    if (this.distanceText) {
      this.distanceText.setText(`${Math.floor(this.distanceM)} м`);
    }

    this.updateFuelMeter(this.fuel);
    this.updateProgressBar(this.progressStage);
    this.updateTimerHud();
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

  private createYachtAnimation() {
    if (this.anims.exists("yacht-sail")) {
      return;
    }

    this.anims.create({
      key: "yacht-sail",
      frames: this.anims.generateFrameNumbers("yacht-sheet", { start: 0, end: 24 }),
      frameRate: 12,
      repeat: -1,
    });
  }

  private createHud(width: number, height: number) {
    this.speedIcon = this.add
      .image(HUD_LAYOUT.speedX - HUD_LAYOUT.iconOffsetX, HUD_LAYOUT.speedY + HUD_LAYOUT.speedIconYOffset, "icon-speed")
      .setOrigin(0.5, 0.5);
    this.speedIcon.setScale(HUD_LAYOUT.speedIconScale);
    this.speedIcon.setDepth(50);

    this.speedText = this.add.text(HUD_LAYOUT.speedX, HUD_LAYOUT.speedY, "20 км/ч", {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.hudSpeedSize,
      fontStyle: UI_TEXT.hudSpeedStyle,
      fontWeight: UI_TEXT.hudSpeedWeight,
      color: UI_TEXT.hudColor,
    });
    this.speedText.setDepth(50);

    this.distanceIcon = this.add
      .image(
        HUD_LAYOUT.distanceX - HUD_LAYOUT.iconOffsetX,
        HUD_LAYOUT.distanceY + HUD_LAYOUT.distanceIconYOffset,
        "icon-flag",
      )
      .setOrigin(0.5, 0.5);
    this.distanceIcon.setScale(HUD_LAYOUT.distanceIconScale);
    this.distanceIcon.setDepth(50);

    this.distanceText = this.add.text(HUD_LAYOUT.distanceX, HUD_LAYOUT.distanceY, "0 м", {
      fontFamily: UI_TEXT.hudFontFamily,
      fontSize: UI_TEXT.hudDistanceSize,
      fontStyle: UI_TEXT.hudDistanceStyle,
      fontWeight: UI_TEXT.hudDistanceWeight,
      color: UI_TEXT.hudColor,
    });
    this.distanceText.setDepth(50);

    this.speedText.setX(HUD_LAYOUT.speedX + HUD_LAYOUT.iconGap);
    this.distanceText.setX(HUD_LAYOUT.distanceX + HUD_LAYOUT.iconGap);

    const meterX = width - HUD_LAYOUT.meterXOffset;
    const meterTop = height * HUD_LAYOUT.meterTopRatio;
    this.fuelBar = this.add.image(meterX, meterTop, "bar-5").setOrigin(0.5, 0);
    this.fuelBar.setScale(HUD_LAYOUT.meterScale);
    this.fuelBar.setDepth(50);

    const barHeight = this.fuelBar.displayHeight;
    const iconY = meterTop + barHeight + HUD_LAYOUT.meterIconGap;
    this.fuelIcon = this.add.image(meterX, iconY, "briefcase-icon").setOrigin(0.5, 0);
    this.fuelIcon.setScale(HUD_LAYOUT.meterIconScale);
    this.fuelIcon.setDepth(50);

    const progressX = width * HUD_LAYOUT.progressXRatio;
    this.progressBar = this.add.image(progressX, HUD_LAYOUT.progressY, this.progressKeys[0]).setOrigin(0.5, 0);
    this.progressBar.setScale(HUD_LAYOUT.progressScale);
    this.progressBar.setDepth(50);

    const progressRightX = progressX + this.progressBar.displayWidth * 0.5;
    const timeBarX = progressRightX + TIME_HUD.xOffset;
    this.timeBar = this.add.image(timeBarX, TIME_HUD.y, "time-bar").setOrigin(0.5, 0);
    this.timeBar.setScale(TIME_HUD.scale);
    this.timeBar.setDepth(50);

    const timeValueY = TIME_HUD.y + this.timeBar.displayHeight * TIME_HUD.valueYOffsetRatio;
    this.timeText = this.add.text(timeBarX, timeValueY, this.formatTimeMMSS(this.remainingTimeMs), {
      fontFamily: TIME_HUD.valueFontFamily,
      fontSize: TIME_HUD.valueFontSize,
      color: TIME_HUD.valueColor,
      fontStyle: "bold",
    });
    this.timeText.setOrigin(0.5, 0.5);
    this.timeText.setDepth(51);
  }

  private createYacht(width: number, height: number) {
    this.playAreaLeft = Math.round(width * PLAY_AREA.leftPaddingRatio);
    this.playAreaRight = Math.round(width * PLAY_AREA.rightPaddingRatio);

    this.controlMinX = FREE_CONTROL_2D.minXPaddingPx;
    this.controlMaxX = width - FREE_CONTROL_2D.maxXPaddingPx;
    this.controlMinY = FREE_CONTROL_2D.minYPaddingPx;
    this.controlMaxY = height - FREE_CONTROL_2D.maxYPaddingPx;

    const startX = Math.round(width * 0.5);
    const startY = Math.round(height * 0.8);

    this.yachtBody = this.physics.add.sprite(startX, startY, "yacht-rect");
    this.yachtBody.body.setAllowGravity(false);
    this.yachtBody.setImmovable(true);
    this.yachtBody.setVisible(false);

    this.yachtVisual = this.add.sprite(startX, startY, "yacht-sheet");
    this.yachtVisual.setDepth(5);
    this.yachtVisual.play("yacht-sail");

    this.targetX = Phaser.Math.Clamp(startX, this.controlMinX, this.controlMaxX);
    this.targetY = Phaser.Math.Clamp(startY, this.controlMinY, this.controlMaxY);
  }

  private createGroups() {
    this.obstacles = this.physics.add.group({ allowGravity: false });
    this.fuels = this.physics.add.group({ allowGravity: false });
    this.dynamicBuoys = this.physics.add.group({ allowGravity: false });
    this.timeBonuses = this.physics.add.group({ allowGravity: false });
    this.landmarks = this.physics.add.group({ allowGravity: false, immovable: true });
  }

  private setupCollisions() {
    if (!this.yachtBody) {
      return;
    }

    this.physics.add.collider(this.yachtBody, this.obstacles, (_yacht, obstacle) => {
      const sprite = obstacle as Phaser.Physics.Arcade.Sprite;
      if (sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.fuel = Math.max(0, this.fuel - TUNING.FUEL_HIT_PENALTY);
      this.showHudFeedback("bar-down");
      if (this.fuel <= 0) {
        this.finishRunOutOfAssets();
        return;
      }
      this.handleObstacleHit(sprite);
    });

    this.physics.add.overlap(this.yachtBody, this.fuels, (_yacht, fuel) => {
      const sprite = fuel as Phaser.Physics.Arcade.Sprite;
      if (sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.fuel = Math.min(1, this.fuel + TUNING.FUEL_PICKUP_VALUE);
      this.showHudFeedback("bar-up");
      this.collectFuel(sprite);
    });

    this.physics.add.overlap(this.yachtBody, this.dynamicBuoys, (_yacht, buoy) => {
      const sprite = buoy as Phaser.Physics.Arcade.Sprite;
      if (sprite.getData("collecting") || this.isGameOver) {
        return;
      }

      const stateKey = this.getDynamicBuoyStateKey(sprite);
      const stateConfig = DYNAMIC_BUOY_STATES[stateKey];
      if (stateKey === "up") {
        this.fuel = Math.min(1, this.fuel + stateConfig.delta);
        this.showHudFeedback("bar-up");
        this.collectFuel(sprite);
      } else if (stateKey === "down") {
        this.fuel = Math.max(0, this.fuel + stateConfig.delta);
        this.showHudFeedback("bar-down");
        if (this.fuel <= 0) {
          this.finishRunOutOfAssets();
          return;
        }
        this.collectFuel(sprite);
      } else {
        this.handleYachtVsEmptyDynamicCollision(sprite);
      }
    });

    this.physics.add.overlap(this.yachtBody, this.timeBonuses, (_yacht, bonus) => {
      const sprite = bonus as Phaser.Physics.Arcade.Sprite;
      if (sprite.getData("collecting") || this.isGameOver) {
        return;
      }
      this.collectAirBonus(sprite);
    });

    this.physics.add.overlap(this.yachtBody, this.landmarks, (_yacht, landmarkObj) => {
      const sprite = landmarkObj as Phaser.Physics.Arcade.Sprite;
      if (this.isGameOver || sprite.getData("collecting")) {
        return;
      }
      sprite.setData("collecting", true);

      const landmarkType = sprite.getData("landmarkType") as LandmarkType | undefined;
      if (landmarkType === "island200") {
        this.finishRunSuccess("success_island_200");
      } else if (landmarkType === "tavern400") {
        this.finishRunSuccess("success_tavern_400");
      } else if (landmarkType === "harbor610") {
        this.finishRunSuccess("success_harbor_610");
      }
    });

    this.physics.add.collider(this.obstacles, this.obstacles, this.handleBuoyCollision, undefined, this);
    this.physics.add.collider(this.fuels, this.fuels, this.handleBuoyCollision, undefined, this);
    this.physics.add.collider(this.dynamicBuoys, this.dynamicBuoys, this.handleBuoyCollision, undefined, this);
    this.physics.add.collider(this.obstacles, this.fuels, this.handleBuoyCollision, undefined, this);
    this.physics.add.collider(this.obstacles, this.dynamicBuoys, this.handleBuoyCollision, undefined, this);
    this.physics.add.collider(this.fuels, this.dynamicBuoys, this.handleBuoyCollision, undefined, this);
  }

  private handleBuoyCollision(objA: Phaser.GameObjects.GameObject, objB: Phaser.GameObjects.GameObject) {
    const buoyA = objA as Phaser.Physics.Arcade.Sprite;
    const buoyB = objB as Phaser.Physics.Arcade.Sprite;
    if (!buoyA.active || !buoyB.active || buoyA.getData("collecting") || buoyB.getData("collecting")) {
      return;
    }

    const nowMs = this.time.now;
    const pairKey = this.getBuoyCollisionPairKey(buoyA, buoyB);
    const lastHitAt = this.buoyCollisionPairLastHit.get(pairKey) ?? Number.NEGATIVE_INFINITY;
    if (nowMs - lastHitAt < BUOY_COLLISION.pairCooldownMs) {
      return;
    }
    this.buoyCollisionPairLastHit.set(pairKey, nowMs);

    const bodyA = buoyA.body as Phaser.Physics.Arcade.Body | undefined;
    const bodyB = buoyB.body as Phaser.Physics.Arcade.Body | undefined;
    const ax = bodyA ? bodyA.center.x : buoyA.x;
    const ay = bodyA ? bodyA.center.y : buoyA.y;
    const bx = bodyB ? bodyB.center.x : buoyB.x;
    const by = bodyB ? bodyB.center.y : buoyB.y;
    const dx = ax - bx;
    const dy = ay - by;
    let normalX = dx;
    let normalY = dy;
    const normalLength = Math.sqrt(normalX * normalX + normalY * normalY);
    if (normalLength === 0) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      normalX = Math.cos(angle);
      normalY = Math.sin(angle);
    } else {
      normalX /= normalLength;
      normalY /= normalLength;
    }

    this.pruneOldBuoyCollisionPairs(nowMs);
    const impulse =
      BUOY_COLLISION.impulsePxPerSec *
      Phaser.Math.FloatBetween(BUOY_COLLISION.impulseRandomMin, BUOY_COLLISION.impulseRandomMax);
    this.applyBuoyCollisionPush(buoyA, normalX, normalY, impulse);
    this.applyBuoyCollisionPush(buoyB, -normalX, -normalY, impulse);
  }

  private handleYachtVsEmptyDynamicCollision(buoy: Phaser.Physics.Arcade.Sprite) {
    if (!this.yachtBody || !buoy.active || buoy.getData("collecting") || this.isGameOver) {
      return;
    }

    const nowMs = this.time.now;
    const pairKey = this.getBuoyCollisionPairKey(this.yachtBody, buoy);
    const lastHitAt = this.buoyCollisionPairLastHit.get(pairKey) ?? Number.NEGATIVE_INFINITY;
    if (nowMs - lastHitAt < BUOY_COLLISION.pairCooldownMs) {
      return;
    }
    this.buoyCollisionPairLastHit.set(pairKey, nowMs);

    const buoyBody = buoy.body as Phaser.Physics.Arcade.Body | undefined;
    const buoyX = buoyBody ? buoyBody.center.x : buoy.x;
    const buoyY = buoyBody ? buoyBody.center.y : buoy.y;
    const ellipse = this.getYachtEllipseParams();
    if (!ellipse) {
      return;
    }

    const contactRadius = this.getDynamicBuoyContactRadius(buoy);
    if (!this.isPointInsideExpandedEllipse(buoyX, buoyY, ellipse, contactRadius)) {
      return;
    }

    const normal = this.getEllipseSurfaceNormalTowardPoint(buoyX, buoyY, ellipse);

    this.pruneOldBuoyCollisionPairs(nowMs);
    const impulse =
      BUOY_COLLISION.impulsePxPerSec *
      Phaser.Math.FloatBetween(BUOY_COLLISION.impulseRandomMin, BUOY_COLLISION.impulseRandomMax);
    this.applyBuoyCollisionPush(buoy, normal.x, normal.y, impulse);
  }

  private getYachtEllipseParams(): EllipseHitboxParams | null {
    if (!this.yachtBody) {
      return null;
    }

    const body = this.yachtBody.body as Phaser.Physics.Arcade.Body | undefined;
    const centerX = (body ? body.center.x : this.yachtBody.x) + YACHT_HITBOX.centerOffsetX;
    const centerY = (body ? body.center.y : this.yachtBody.y) + YACHT_HITBOX.centerOffsetY;
    const radiusX = Math.max(YACHT_HITBOX.minRadiusX, OBJECT_SIZES.yacht.width * YACHT_HITBOX.radiusXRatio);
    const radiusY = Math.max(YACHT_HITBOX.minRadiusY, OBJECT_SIZES.yacht.height * YACHT_HITBOX.radiusYRatio);
    return { centerX, centerY, radiusX, radiusY };
  }

  private getDynamicBuoyContactRadius(buoy: Phaser.Physics.Arcade.Sprite) {
    const minSize = Math.min(buoy.displayWidth, buoy.displayHeight);
    return minSize * YACHT_HITBOX.dynamicBuoyRadiusRatio;
  }

  private isPointInsideExpandedEllipse(px: number, py: number, ellipse: EllipseHitboxParams, extraRadius: number) {
    const expandedRadiusX = Math.max(1, ellipse.radiusX + extraRadius + YACHT_HITBOX.contactPaddingPx);
    const expandedRadiusY = Math.max(1, ellipse.radiusY + extraRadius + YACHT_HITBOX.contactPaddingPx);
    const nx = (px - ellipse.centerX) / expandedRadiusX;
    const ny = (py - ellipse.centerY) / expandedRadiusY;
    return nx * nx + ny * ny <= 1;
  }

  private getEllipseSurfaceNormalTowardPoint(px: number, py: number, ellipse: EllipseHitboxParams) {
    let normalX = (px - ellipse.centerX) / (ellipse.radiusX * ellipse.radiusX);
    let normalY = (py - ellipse.centerY) / (ellipse.radiusY * ellipse.radiusY);
    let normalLength = Math.sqrt(normalX * normalX + normalY * normalY);

    if (normalLength < 1e-6) {
      normalX = px - ellipse.centerX;
      normalY = py - ellipse.centerY;
      normalLength = Math.sqrt(normalX * normalX + normalY * normalY);
    }

    if (normalLength < 1e-6) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      return { x: Math.cos(angle), y: Math.sin(angle) };
    }

    return { x: normalX / normalLength, y: normalY / normalLength };
  }

  private applyBuoyCollisionPush(sprite: Phaser.Physics.Arcade.Sprite, normalX: number, normalY: number, impulse: number) {
    const currentPushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
    const currentPushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
    const currentPushX = (sprite.getData("pushX") as number | undefined) ?? 0;
    const nextPushVy = Phaser.Math.Clamp(
      currentPushVy + normalY * impulse * BUOY_COLLISION.verticalImpulseFactor,
      -BUOY_COLLISION.maxVerticalPushPxPerSec,
      BUOY_COLLISION.maxVerticalPushPxPerSec,
    );
    sprite.setData("pushVx", currentPushVx + normalX * impulse);
    sprite.setData("pushVy", nextPushVy);
    sprite.setData("pushX", currentPushX + normalX * BUOY_COLLISION.separationPx);
    sprite.setData("lastCollisionAt", this.time.now);
  }

  private getBuoyCollisionPairKey(a: Phaser.Physics.Arcade.Sprite, b: Phaser.Physics.Arcade.Sprite) {
    const aId = this.getBuoyCollisionId(a);
    const bId = this.getBuoyCollisionId(b);
    return aId < bId ? `${aId}:${bId}` : `${bId}:${aId}`;
  }

  private getBuoyCollisionId(sprite: Phaser.Physics.Arcade.Sprite) {
    const existing = sprite.getData("buoyCollisionId") as number | undefined;
    if (existing !== undefined) {
      return existing;
    }
    this.buoyCollisionIdCounter += 1;
    sprite.setData("buoyCollisionId", this.buoyCollisionIdCounter);
    return this.buoyCollisionIdCounter;
  }

  private pruneOldBuoyCollisionPairs(nowMs: number) {
    if (this.buoyCollisionPairLastHit.size < 512) {
      return;
    }
    const cutoff = nowMs - BUOY_COLLISION.pairCooldownMs * 8;
    this.buoyCollisionPairLastHit.forEach((timeMs, key) => {
      if (timeMs < cutoff) {
        this.buoyCollisionPairLastHit.delete(key);
      }
    });
  }

  private applyBuoyHitbox(sprite: Phaser.Physics.Arcade.Sprite, type: BuoyType, width: number, height: number) {
    const body = sprite.body as Phaser.Physics.Arcade.Body | undefined;
    if (!body) {
      return;
    }
    const config = BUOY_HITBOX[type];
    const radius = Math.max(1, Math.round(Math.min(width, height) * config.radiusRatio * BUOY_HITBOX.globalScale));
    body.setCircle(radius);
    const offsetX = width * config.centerXRatio - radius;
    const offsetY = height * config.centerYRatio - radius;
    body.setOffset(offsetX, offsetY);
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

  private updateTargetPosition(pointerX: number, pointerY: number) {
    this.targetX = Phaser.Math.Clamp(pointerX, this.controlMinX, this.controlMaxX);
    this.targetY = Phaser.Math.Clamp(pointerY, this.controlMinY, this.controlMaxY);
  }

  private resetPointerControlState() {
    this.pointerControlActive = false;
    this.pointerControlId = undefined;
    if (this.yachtBody) {
      this.targetX = this.yachtBody.x;
      this.targetY = this.yachtBody.y - this.yMotionOffsetPx;
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
    return TUNING.SPEED_START_KMH + Math.floor(distanceM / 100) * TUNING.SPEED_PER_100M;
  }

  private getInitialRunSpeedKmh() {
    return Math.max(0, TUNING.SPEED_START_KMH - RUN_START_SPEED.startDropKmh);
  }

  private updateFuelMeter(fuel: number) {
    if (!this.fuelBar) {
      return;
    }
    const segmentsOn = Math.max(1, Math.round(Phaser.Math.Clamp(fuel, 0, 1) * HUD_LAYOUT.meterSegments));
    const frameIndex = Phaser.Math.Clamp(segmentsOn, 1, this.fuelBarKeys.length);
    const textureKey = this.fuelBarKeys[frameIndex - 1];
    if (this.fuelBar.texture.key !== textureKey) {
      this.fuelBar.setTexture(textureKey);
    }
  }

  private updateProgressBar(progressStage: number) {
    if (!this.progressBar) {
      return;
    }
    const stageIndex = Phaser.Math.Clamp(progressStage, 0, this.progressKeys.length - 1);
    const key = this.progressKeys[stageIndex];
    if (this.progressBar.texture.key !== key) {
      this.progressBar.setTexture(key);
    }
  }

  private scheduleObstacleSpawn() {
    const delay = this.getObstacleSpawnDelay();
    this.obstacleTimer = this.time.delayedCall(delay, () => {
      if (this.isGameOver) {
        return;
      }
      if (!this.isInSpawnPauseWindow(this.distanceM)) {
        this.spawnObstacle();
      }
      this.scheduleObstacleSpawn();
    });
  }

  private scheduleFuelSpawn() {
    const delay = this.getFuelSpawnDelay();
    this.fuelTimer = this.time.delayedCall(delay, () => {
      if (this.isGameOver) {
        return;
      }
      if (!this.isInSpawnPauseWindow(this.distanceM)) {
        this.spawnFuel();
      }
      this.scheduleFuelSpawn();
    });
  }

  private scheduleDynamicSpawn() {
    const delay = this.getDynamicSpawnDelay();
    this.dynamicTimer = this.time.delayedCall(delay, () => {
      if (this.isGameOver) {
        return;
      }
      if (!this.isInSpawnPauseWindow(this.distanceM)) {
        this.spawnDynamicBuoy();
      }
      this.scheduleDynamicSpawn();
    });
  }

  private scheduleAirBonusSpawn(forcedType?: AirBonusType) {
    const nextType = forcedType ?? this.chooseNextAirBonusType();
    this.scheduledAirBonusType = nextType;
    const delay = this.getAirBonusSpawnDelay(nextType);
    this.bonusSpawnTimer = this.time.delayedCall(delay, () => {
      if (this.isGameOver) {
        return;
      }
      this.spawnAirBonus(nextType);
      this.registerSpawnedAirBonusType(nextType);
      this.scheduleAirBonusSpawn();
    });
  }

  private initializeSpawnRangeState() {
    this.currentBuoySpawnRangeIndex = this.getDistanceRangeIndex(SPAWN_MULTIPLIERS);
    this.currentTimeBonusSpawnRangeIndex = this.getDistanceRangeIndex(TIME_BONUS_SPAWN_MULTIPLIERS);
    this.currentSpeedBonusSpawnRangeIndex = this.getDistanceRangeIndex(SPEED_BONUS_SPAWN_MULTIPLIERS);
  }

  private updateSpawnTimersForDistanceRange() {
    const nextBuoySpawnRangeIndex = this.getDistanceRangeIndex(SPAWN_MULTIPLIERS);
    if (nextBuoySpawnRangeIndex != this.currentBuoySpawnRangeIndex) {
      this.currentBuoySpawnRangeIndex = nextBuoySpawnRangeIndex;
      this.rescheduleBuoySpawnTimers();
    }

    const nextTimeBonusSpawnRangeIndex = this.getDistanceRangeIndex(TIME_BONUS_SPAWN_MULTIPLIERS);
    const nextSpeedBonusSpawnRangeIndex = this.getDistanceRangeIndex(SPEED_BONUS_SPAWN_MULTIPLIERS);
    const timeBonusRangeChanged = nextTimeBonusSpawnRangeIndex != this.currentTimeBonusSpawnRangeIndex;
    const speedBonusRangeChanged = nextSpeedBonusSpawnRangeIndex != this.currentSpeedBonusSpawnRangeIndex;

    this.currentTimeBonusSpawnRangeIndex = nextTimeBonusSpawnRangeIndex;
    this.currentSpeedBonusSpawnRangeIndex = nextSpeedBonusSpawnRangeIndex;

    if (
      (this.scheduledAirBonusType === "time" && timeBonusRangeChanged) ||
      (this.scheduledAirBonusType === "speed" && speedBonusRangeChanged)
    ) {
      this.rescheduleAirBonusSpawnTimer();
    }
  }

  private rescheduleBuoySpawnTimers() {
    this.obstacleTimer?.remove(false);
    this.fuelTimer?.remove(false);
    this.dynamicTimer?.remove(false);
    this.obstacleTimer = undefined;
    this.fuelTimer = undefined;
    this.dynamicTimer = undefined;
    this.scheduleObstacleSpawn();
    this.scheduleFuelSpawn();
    this.scheduleDynamicSpawn();
  }

  private rescheduleAirBonusSpawnTimer() {
    const scheduledType = this.scheduledAirBonusType;
    this.bonusSpawnTimer?.remove(false);
    this.bonusSpawnTimer = undefined;
    this.scheduleAirBonusSpawn(scheduledType);
  }

  private spawnObstacle() {
    const x = Phaser.Math.Between(this.playAreaLeft + 24, this.playAreaRight - 24);
    const y = -40;
    const baseSpeed = this.getBuoyAndAirFallSpeed();
    const speedVarianceMultiplier = this.getSpeedVarianceMultiplier();
    const speed = baseSpeed * speedVarianceMultiplier;
    const obstacle = this.obstacles.get(x, y, "money-down") as Phaser.Physics.Arcade.Sprite | null;

    if (!obstacle) {
      return;
    }

    obstacle.setActive(true).setVisible(true);
    obstacle.setAlpha(1);
    obstacle.setRotation(0);
    obstacle.body.setAllowGravity(false);
    obstacle.body.setSize(OBJECT_SIZES.obstacle.width, OBJECT_SIZES.obstacle.height, true);
    obstacle.setDisplaySize(OBJECT_SIZES.obstacle.width, OBJECT_SIZES.obstacle.height);
    this.applyBuoyHitbox(obstacle, "obstacle", OBJECT_SIZES.obstacle.width, OBJECT_SIZES.obstacle.height);
    obstacle.setDepth(10);
    obstacle.setVelocity(0, speed);
    obstacle.setData("speed", speed);
    obstacle.setData("speedVarianceMultiplier", speedVarianceMultiplier);
    obstacle.setData("collecting", false);
    obstacle.setData("driftBaseX", x);
    obstacle.setData("driftAmplitude", OBJECT_DRIFT.obstacle.amplitudePx);
    obstacle.setData("driftFrequency", OBJECT_DRIFT.obstacle.frequencyHz);
    obstacle.setData("driftPhase", Phaser.Math.FloatBetween(OBJECT_DRIFT.obstacle.phaseMin, OBJECT_DRIFT.obstacle.phaseMax));
    obstacle.setData("swayPhase", Phaser.Math.FloatBetween(OBSTACLE_SWAY.phaseMin, OBSTACLE_SWAY.phaseMax));
    obstacle.setData("pushX", 0);
    obstacle.setData("pushVx", 0);
    obstacle.setData("pushVy", 0);
    obstacle.setData("lastCollisionAt", 0);
  }

  private spawnFuel() {
    const x = Phaser.Math.Between(this.playAreaLeft + 20, this.playAreaRight - 20);
    const y = -30;
    const baseSpeed = this.getBuoyAndAirFallSpeed() / 1.5;
    const speedVarianceMultiplier = this.getSpeedVarianceMultiplier();
    const speed = baseSpeed * speedVarianceMultiplier;
    const fuel = this.fuels.get(x, y, "money-up") as Phaser.Physics.Arcade.Sprite | null;

    if (!fuel) {
      return;
    }

    fuel.setActive(true).setVisible(true);
    fuel.setAlpha(1);
    fuel.setRotation(0);
    fuel.body.setAllowGravity(false);
    fuel.body.setSize(OBJECT_SIZES.fuel.width, OBJECT_SIZES.fuel.height, true);
    fuel.setDisplaySize(OBJECT_SIZES.fuel.width * FUEL_VISUAL_SCALE, OBJECT_SIZES.fuel.height * FUEL_VISUAL_SCALE);
    this.applyBuoyHitbox(fuel, "fuel", fuel.displayWidth, fuel.displayHeight);
    fuel.setDepth(10);
    fuel.setVelocity(0, speed);
    fuel.setData("speed", speed);
    fuel.setData("speedVarianceMultiplier", speedVarianceMultiplier);
    fuel.setData("collecting", false);
    fuel.setData("driftBaseX", x);
    fuel.setData("driftAmplitude", OBJECT_DRIFT.fuel.amplitudePx);
    fuel.setData("driftFrequency", OBJECT_DRIFT.fuel.frequencyHz);
    fuel.setData("driftPhase", Phaser.Math.FloatBetween(OBJECT_DRIFT.fuel.phaseMin, OBJECT_DRIFT.fuel.phaseMax));
    fuel.setData("swayPhase", Phaser.Math.FloatBetween(FUEL_SWAY.phaseMin, FUEL_SWAY.phaseMax));
    fuel.setData("pushX", 0);
    fuel.setData("pushVx", 0);
    fuel.setData("pushVy", 0);
    fuel.setData("lastCollisionAt", 0);
  }

  private spawnDynamicBuoy() {
    const x = Phaser.Math.Between(this.playAreaLeft + 20, this.playAreaRight - 20);
    const y = -30;
    const baseSpeed = this.getBuoyAndAirFallSpeed() / 1.5;
    const speedVarianceMultiplier = this.getSpeedVarianceMultiplier();
    const speed = baseSpeed * speedVarianceMultiplier;
    const initialStateKey = Phaser.Utils.Array.GetRandom([...DYNAMIC_BUOY_STATE_ORDER]) as DynamicBuoyStateKey;
    const targetWidth = OBJECT_SIZES.dynamic.width * FUEL_VISUAL_SCALE;
    const targetHeight = OBJECT_SIZES.dynamic.height * FUEL_VISUAL_SCALE;
    const dynamicBuoy = this.dynamicBuoys.get(x, y, "money-change-up") as Phaser.Physics.Arcade.Sprite | null;

    if (!dynamicBuoy) {
      return;
    }

    this.stopDynamicBuoyStateTimer(dynamicBuoy);
    dynamicBuoy.setActive(true).setVisible(true);
    dynamicBuoy.setAlpha(1);
    dynamicBuoy.setRotation(0);
    dynamicBuoy.body.setAllowGravity(false);
    dynamicBuoy.body.setSize(OBJECT_SIZES.dynamic.width, OBJECT_SIZES.dynamic.height, true);
    dynamicBuoy.setTexture(DYNAMIC_BUOY_STATES[initialStateKey].textureKey);
    dynamicBuoy.setDisplaySize(targetWidth, targetHeight);
    this.applyBuoyHitbox(dynamicBuoy, "dynamic", targetWidth, targetHeight);
    dynamicBuoy.setDepth(10);
    dynamicBuoy.setVelocity(0, speed);
    dynamicBuoy.setData("speed", speed);
    dynamicBuoy.setData("speedVarianceMultiplier", speedVarianceMultiplier);
    dynamicBuoy.setData("collecting", false);
    dynamicBuoy.setData("driftBaseX", x);
    dynamicBuoy.setData("driftAmplitude", OBJECT_DRIFT.dynamic.amplitudePx);
    dynamicBuoy.setData("driftFrequency", OBJECT_DRIFT.dynamic.frequencyHz);
    dynamicBuoy.setData("driftPhase", Phaser.Math.FloatBetween(OBJECT_DRIFT.dynamic.phaseMin, OBJECT_DRIFT.dynamic.phaseMax));
    dynamicBuoy.setData("swayPhase", Phaser.Math.FloatBetween(DYNAMIC_SWAY.phaseMin, DYNAMIC_SWAY.phaseMax));
    dynamicBuoy.setData("dynamicStateKey", initialStateKey);
    dynamicBuoy.setData("dynamicState", DYNAMIC_BUOY_STATES[initialStateKey].stateId);
    const initialNoNextStateKey =
      initialStateKey === "no"
        ? (Phaser.Utils.Array.GetRandom(["up", "down"]) as Exclude<DynamicBuoyStateKey, "no">)
        : (initialStateKey === "up" ? "down" : "up");
    dynamicBuoy.setData("dynamicNoNextStateKey", initialNoNextStateKey);
    dynamicBuoy.setData("pushX", 0);
    dynamicBuoy.setData("pushVx", 0);
    dynamicBuoy.setData("pushVy", 0);
    dynamicBuoy.setData("lastCollisionAt", 0);

    const initialStateConfig = DYNAMIC_BUOY_STATES[initialStateKey];
    const stateTimer = this.time.addEvent({
      delay: initialStateConfig.durationMs,
      loop: false,
      callback: () => {
        if (!dynamicBuoy.active || dynamicBuoy.getData("collecting")) {
          return;
        }
        this.advanceDynamicBuoyState(dynamicBuoy);
      },
    });
    dynamicBuoy.setData("stateTimer", stateTimer);
  }

  private spawnAirBonus(type: AirBonusType) {
    const config = this.getAirBonusConfig(type);
    const spawnFromLeft = Phaser.Math.Between(0, 1) === 0;
    const x = spawnFromLeft
      ? this.playAreaLeft - config.spawnSideOffset
      : this.playAreaRight + config.spawnSideOffset;
    const y = config.spawnYOffset;
    const speedY = this.getAirBonusFallSpeed(type);
    const directionX = spawnFromLeft ? 1 : -1;
    const speedX = directionX * config.zigzagHorizontalSpeed;

    const bonus = this.timeBonuses.get(x, y, config.textureKey) as Phaser.Physics.Arcade.Sprite | null;
    if (!bonus) {
      return;
    }

    this.destroyTimeBonusShadow(bonus);
    bonus.setActive(true).setVisible(true);
    bonus.setAlpha(1);
    bonus.setRotation(0);
    bonus.setDepth(config.depth);
    bonus.body.setAllowGravity(false);
    bonus.body.setSize(Math.round(config.size * 0.72), Math.round(config.size * 0.72), true);
    bonus.setDisplaySize(config.size, config.size);
    bonus.setVelocity(speedX, speedY);
    bonus.setData("collecting", false);
    bonus.setData("bonusType", type);
    bonus.setData("speedY", speedY);
    bonus.setData("speedYMultiplier", config.speedYMultiplier);
    bonus.setData("zigzagHorizontalSpeed", config.zigzagHorizontalSpeed);
    bonus.setData("zigzagLeftBoundOffset", config.zigzagLeftBoundOffset);
    bonus.setData("zigzagRightBoundOffset", config.zigzagRightBoundOffset);
    bonus.setData("shadowYOffset", config.shadowYOffset);
    bonus.setData("shadowAlpha", config.shadowAlpha);
    bonus.setData("cleanupPadding", config.size * 1.5);
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

    const shadow = this.add.image(x, y + config.shadowYOffset, config.shadowTextureKey);
    shadow.setDisplaySize(config.shadowWidth, config.shadowHeight);
    shadow.setScale(config.shadowBobScale.baseScaleX, config.shadowBobScale.baseScaleY);
    shadow.setAlpha(config.shadowAlpha);
    shadow.setDepth(config.shadowDepth);
    bonus.setData("shadow", shadow);
  }

  private getAirBonusConfig(type: AirBonusType) {
    return type === "speed" ? SPEED_BONUS : TIME_BONUS;
  }

  private chooseNextAirBonusType(): AirBonusType {
    if (!this.lastSpawnedBonusType) {
      if (BONUS_SPAWN.initialType === "time") {
        return "time";
      }
      if (BONUS_SPAWN.initialType === "speed") {
        return "speed";
      }
      return Phaser.Math.Between(0, 1) === 0 ? "time" : "speed";
    }

    if (this.sameTypeSpawnStreak >= BONUS_SPAWN.maxConsecutiveSameType) {
      return this.lastSpawnedBonusType === "time" ? "speed" : "time";
    }

    return Phaser.Math.Between(0, 1) === 0 ? "time" : "speed";
  }

  private registerSpawnedAirBonusType(type: AirBonusType) {
    if (this.lastSpawnedBonusType === type) {
      this.sameTypeSpawnStreak += 1;
    } else {
      this.lastSpawnedBonusType = type;
      this.sameTypeSpawnStreak = 1;
    }
  }

  private spawnLandmarksByDistance() {
    if (!this.spawnedLandmarks.island200 && this.distanceM >= LANDMARK_METERS.island200) {
      this.spawnedLandmarks.island200 = true;
      this.spawnLandmark("earth-1", "island200", LANDMARK_LAYOUT.island200);
    }

    if (!this.spawnedLandmarks.tavern400 && this.distanceM >= LANDMARK_METERS.tavern400) {
      this.spawnedLandmarks.tavern400 = true;
      this.spawnLandmark("earth-2", "tavern400", LANDMARK_LAYOUT.tavern400);
    }

    if (!this.spawnedLandmarks.harbor610 && this.distanceM >= LANDMARK_METERS.harbor610) {
      this.spawnedLandmarks.harbor610 = true;
      this.spawnLandmark("earth-3", "harbor610", LANDMARK_LAYOUT.harbor610);
      this.spawnHarborGate();
    }
  }

  private spawnLandmark(textureKey: string, type: LandmarkType, config: LandmarkConfig) {
    const x = Math.round(this.scale.width * config.xRatio);
    const y = LANDMARK_LAYOUT.spawnY;
    const speed = this.getLandmarkFallSpeed();
    const sprite = this.landmarks.get(x, y, textureKey) as Phaser.Physics.Arcade.Sprite | null;

    if (!sprite) {
      return;
    }

    sprite.setActive(true).setVisible(true);
    sprite.setAlpha(1);
    sprite.setRotation(0);
    sprite.setTexture(textureKey);
    sprite.setDisplaySize(config.width, config.height);
    sprite.setDepth(15);
    sprite.body.setAllowGravity(false);
    sprite.setImmovable(true);
    sprite.setVelocity(0, speed);
    sprite.body.setSize(
      Math.max(8, Math.round(config.width * config.hitboxScaleX)),
      Math.max(8, Math.round(config.height * config.hitboxScaleY)),
      true,
    );
    sprite.setData("collecting", false);
    sprite.setData("landmarkType", type);
  }

  private spawnHarborGate() {
    const gateX = (this.playAreaLeft + this.playAreaRight) * 0.5;
    const gateY = LANDMARK_LAYOUT.spawnY + LANDMARK_LAYOUT.harborGate.yOffset;
    const gateWidth = this.playAreaRight - this.playAreaLeft;
    const gateHeight = LANDMARK_LAYOUT.harborGate.height;

    this.harborGate?.destroy();

    const gate = this.physics.add.image(gateX, gateY, "yacht-rect");
    gate.setVisible(false);
    gate.setAlpha(0);
    gate.setImmovable(true);
    gate.body.setAllowGravity(false);
    gate.setDisplaySize(gateWidth, gateHeight);
    gate.body.setSize(gateWidth, gateHeight, true);
    gate.setDepth(14);
    gate.setVelocity(0, this.getLandmarkFallSpeed());

    this.harborGate = gate;

    if (this.yachtBody) {
      this.physics.add.overlap(this.yachtBody, gate, () => {
        if (!this.isGameOver) {
          this.finishRunSuccess("success_harbor_610");
        }
      });
    }
  }

  private updatePendingCoins() {
    for (const milestone of COIN_PENDING_MILESTONES) {
      if (!this.reachedCoinMilestones.has(milestone.meters) && this.distanceM >= milestone.meters) {
        this.reachedCoinMilestones.add(milestone.meters);
        this.pendingCoins += milestone.coins;
      }
    }
  }

  private updateCheckpointProgress() {
    let nextStage = 0;
    for (const checkpoint of DISTANCE_CHECKPOINTS) {
      if (this.distanceM >= checkpoint) {
        nextStage += 1;
      }
    }
    this.progressStage = nextStage;
  }

  private isInSpawnPauseWindow(distanceM: number) {
    const windows = [LANDMARK_METERS.island200, LANDMARK_METERS.tavern400, LANDMARK_METERS.harbor610];
    return windows.some((center) => {
      return distanceM >= center - SPAWN_PAUSE_WINDOW_METERS && distanceM <= center + SPAWN_PAUSE_WINDOW_METERS;
    });
  }

  private updateSpawnPauseState() {
    const inPauseWindow = this.isInSpawnPauseWindow(this.distanceM);
    if (inPauseWindow && !this.isSpawnPauseActive) {
      this.pruneOffscreenBuoysForSpawnPauseWindow();
    }
    this.isSpawnPauseActive = inPauseWindow;
  }

  private pruneOffscreenBuoysForSpawnPauseWindow() {
    this.obstacles.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && this.isSpriteFullyOffscreen(sprite)) {
        sprite.destroy();
      }
    });

    this.fuels.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && this.isSpriteFullyOffscreen(sprite)) {
        sprite.destroy();
      }
    });

    this.dynamicBuoys.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && this.isSpriteFullyOffscreen(sprite)) {
        this.stopDynamicBuoyStateTimer(sprite);
        sprite.destroy();
      }
    });
  }

  private isSpriteFullyOffscreen(sprite: Phaser.Physics.Arcade.Sprite) {
    const marginPx = 12;
    const view = this.cameras.main.worldView;
    const expandedView = new Phaser.Geom.Rectangle(
      view.x - marginPx,
      view.y - marginPx,
      view.width + marginPx * 2,
      view.height + marginPx * 2,
    );
    const bounds = sprite.getBounds();
    return !Phaser.Geom.Intersects.RectangleToRectangle(expandedView, bounds);
  }

  private updateLandmarkVelocities() {
    const speed = this.getLandmarkFallSpeed();

    this.landmarks.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active) {
        sprite.setVelocityY(speed);
      }
    });

    if (this.harborGate?.active) {
      this.harborGate.setVelocityY(speed);
    }
  }

  private updateActiveBuoyAndAirFallSpeeds(deltaSec: number) {
    const buoyBaseSpeed = this.getBuoyAndAirFallSpeed();
    const fuelAndDynamicBaseSpeed = buoyBaseSpeed / 1.5;

    const updateBuoyGroup = (sprite: Phaser.Physics.Arcade.Sprite, baseSpeed: number) => {
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      const speedVarianceMultiplier = (sprite.getData("speedVarianceMultiplier") as number | undefined) ?? 1;
      let pushVy = (sprite.getData("pushVy") as number | undefined) ?? 0;
      const damping = Math.max(0, 1 - BUOY_COLLISION.pushDampingPerSec * deltaSec);
      pushVy *= damping;
      if (Math.abs(pushVy) < 0.5) {
        pushVy = 0;
      }
      sprite.setData("pushVy", pushVy);

      const varianceBaseSpeed = baseSpeed * speedVarianceMultiplier;
      const minFallSpeed = varianceBaseSpeed * BUOY_COLLISION.minFallSpeedFactor;
      const targetSpeedY = Math.max(minFallSpeed, varianceBaseSpeed + pushVy);
      sprite.setVelocityY(targetSpeedY);
      sprite.setData("speed", targetSpeedY);
    };

    this.obstacles.children.each((child) => {
      updateBuoyGroup(child as Phaser.Physics.Arcade.Sprite, buoyBaseSpeed);
    });

    this.fuels.children.each((child) => {
      updateBuoyGroup(child as Phaser.Physics.Arcade.Sprite, fuelAndDynamicBaseSpeed);
    });

    this.dynamicBuoys.children.each((child) => {
      updateBuoyGroup(child as Phaser.Physics.Arcade.Sprite, fuelAndDynamicBaseSpeed);
    });

    this.timeBonuses.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (!sprite.active || sprite.getData("collecting")) {
        return;
      }
      const bonusType = (sprite.getData("bonusType") as AirBonusType | undefined) ?? "time";
      const speedYMultiplier =
        (sprite.getData("speedYMultiplier") as number | undefined) ?? this.getAirBonusConfig(bonusType).speedYMultiplier;
      const targetSpeedY = this.getBaseFallSpeedByKmh(this.speedKmh) * speedYMultiplier;
      sprite.setVelocityY(targetSpeedY);
      sprite.setData("speedY", targetSpeedY);
    });
  }

  private cleanupFallingObjects() {
    const maxY = this.scale.height + 60;
    const landmarkMaxY = this.scale.height + 220;

    this.obstacles.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && sprite.y > maxY) {
        sprite.destroy();
      }
    });

    this.fuels.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && sprite.y > maxY) {
        sprite.destroy();
      }
    });

    this.dynamicBuoys.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting") && sprite.y > maxY) {
        this.stopDynamicBuoyStateTimer(sprite);
        sprite.destroy();
      }
    });

    this.timeBonuses.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      const cleanupPadding = (sprite.getData("cleanupPadding") as number | undefined) ?? TIME_BONUS.size * 1.5;
      const minX = -cleanupPadding;
      const maxX = this.scale.width + cleanupPadding;
      const isOutByY = sprite.y > maxY;
      const isOutByX = sprite.x < minX || sprite.x > maxX;
      if (sprite.active && !sprite.getData("collecting") && (isOutByY || isOutByX)) {
        this.destroyTimeBonusShadow(sprite);
        sprite.destroy();
      }
    });

    this.landmarks.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && sprite.y > landmarkMaxY) {
        sprite.destroy();
      }
    });

    if (this.harborGate && this.harborGate.active && this.harborGate.y > landmarkMaxY) {
      this.harborGate.destroy();
      this.harborGate = undefined;
    }
  }

  private handleObstacleHit(obstacle: Phaser.Physics.Arcade.Sprite) {
    obstacle.setData("collecting", true);
    obstacle.setVelocity(0, 0);
    obstacle.body.enable = false;
    const startScaleX = obstacle.scaleX;
    const startScaleY = obstacle.scaleY;
    const upDuration = IMPACT_ANIMATION.spinDurationMs * IMPACT_ANIMATION.scaleUpPortion;
    const downDuration = IMPACT_ANIMATION.spinDurationMs * IMPACT_ANIMATION.scaleDownPortion;

    this.tweens.add({
      targets: obstacle,
      rotation: obstacle.rotation + Math.PI * 2,
      duration: IMPACT_ANIMATION.spinDurationMs,
      ease: "Sine.easeOut",
    });

    this.tweens.add({
      targets: obstacle,
      scaleX: startScaleX * IMPACT_ANIMATION.scaleUp,
      scaleY: startScaleY * IMPACT_ANIMATION.scaleUp,
      duration: upDuration,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: obstacle,
          scaleX: startScaleX * IMPACT_ANIMATION.spinScaleMin,
          scaleY: startScaleY * IMPACT_ANIMATION.spinScaleMin,
          duration: downDuration,
          ease: "Sine.easeIn",
          onComplete: () => obstacle.destroy(),
        });
      },
    });
  }

  private showHudFeedback(key: "bar-up" | "bar-down") {
    if (!this.fuelBar) {
      return;
    }
    const x = this.fuelBar.x;
    const y = this.fuelBar.y + HUD_FEEDBACK.offsetY;
    const icon = this.add.image(x, y, key).setOrigin(0.5, 0.5);
    icon.setDepth(60);

    const baseScale = 1;
    icon.setScale(baseScale * HUD_FEEDBACK.scaleFrom);
    this.tweens.add({
      targets: icon,
      scale: baseScale * HUD_FEEDBACK.scaleUp,
      duration: HUD_FEEDBACK.appearDurationMs,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: icon,
          scale: baseScale * HUD_FEEDBACK.scaleHold,
          duration: HUD_FEEDBACK.upDurationMs,
          ease: "Sine.easeOut",
          onComplete: () => {
            this.tweens.add({
              targets: icon,
              scale: baseScale * HUD_FEEDBACK.scaleHold,
              duration: HUD_FEEDBACK.holdDurationMs,
              onComplete: () => {
                this.tweens.add({
                  targets: icon,
                  scale: 0,
                  duration: HUD_FEEDBACK.downDurationMs,
                  ease: "Sine.easeIn",
                  onComplete: () => icon.destroy(),
                });
              },
            });
          },
        });
      },
    });
  }

  private updateDriftedObjects(deltaSec: number) {
    const timeSec = this.time.now / 1000;

    const updateSprite = (sprite: Phaser.Physics.Arcade.Sprite) => {
      const baseX = sprite.getData("driftBaseX") as number | undefined;
      const amplitude = sprite.getData("driftAmplitude") as number | undefined;
      const frequency = sprite.getData("driftFrequency") as number | undefined;
      const phase = sprite.getData("driftPhase") as number | undefined;

      if (baseX === undefined || amplitude === undefined || frequency === undefined || phase === undefined) {
        return;
      }

      let pushX = (sprite.getData("pushX") as number | undefined) ?? 0;
      let pushVx = (sprite.getData("pushVx") as number | undefined) ?? 0;
      pushX += pushVx * deltaSec;
      pushX = Phaser.Math.Clamp(pushX, -BUOY_COLLISION.maxPushOffsetPx, BUOY_COLLISION.maxPushOffsetPx);
      const damping = Math.max(0, 1 - BUOY_COLLISION.pushDampingPerSec * deltaSec);
      pushVx *= damping;
      if (Math.abs(pushVx) < 0.5) {
        pushVx = 0;
      }
      if (pushVx === 0 && Math.abs(pushX) < 0.1) {
        pushX = 0;
      }
      sprite.setData("pushX", pushX);
      sprite.setData("pushVx", pushVx);

      const baseDriftX = baseX + Math.sin(timeSec * frequency + phase) * amplitude;
      sprite.x = baseDriftX + pushX;
    };

    this.obstacles.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting")) {
        updateSprite(sprite);
        const swayPhase = sprite.getData("swayPhase") as number | undefined;
        if (swayPhase !== undefined) {
          const sway = Math.sin(timeSec * OBSTACLE_SWAY.frequencyHz + swayPhase);
          sprite.setRotation(Phaser.Math.DegToRad(OBSTACLE_SWAY.amplitudeDeg) * sway);
        }
      }
    });

    this.fuels.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting")) {
        updateSprite(sprite);
        const swayPhase = sprite.getData("swayPhase") as number | undefined;
        if (swayPhase !== undefined) {
          const sway = Math.sin(timeSec * FUEL_SWAY.frequencyHz + swayPhase);
          sprite.setRotation(Phaser.Math.DegToRad(FUEL_SWAY.amplitudeDeg) * sway);
        }
      }
    });

    this.dynamicBuoys.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      if (sprite.active && !sprite.getData("collecting")) {
        updateSprite(sprite);
        const swayPhase = sprite.getData("swayPhase") as number | undefined;
        if (swayPhase !== undefined) {
          const sway = Math.sin(timeSec * DYNAMIC_SWAY.frequencyHz + swayPhase);
          sprite.setRotation(Phaser.Math.DegToRad(DYNAMIC_SWAY.amplitudeDeg) * sway);
        }
      }
    });
  }

  private updateTimeBonuses(_deltaSec: number) {
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

        const speedY = (sprite.getData("speedY") as number | undefined) ?? 0;
        if (speedY > 0 && body.velocity.y !== speedY) {
          sprite.setVelocityY(speedY);
        }

        const yBobAmplitude = (sprite.getData("yBobAmplitude") as number | undefined) ?? 0;
        const yBobFrequency = (sprite.getData("yBobFrequency") as number | undefined) ?? 0;
        const yBobPhase = (sprite.getData("yBobPhase") as number | undefined) ?? 0;
        const prevOffset = (sprite.getData("yBobOffsetPrev") as number | undefined) ?? 0;
        const nextOffset = Math.sin(timeSec * yBobFrequency + yBobPhase) * yBobAmplitude;
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

  private isSpeedBonusActive() {
    return this.speedBonusRemainingMs > 0;
  }

  private getSpeedBonusFallMultiplier(speedKmh: number) {
    const entry = SPEED_BONUS_FALL_SPEED_MULTIPLIERS.find((item) => speedKmh >= item.minKmh && speedKmh < item.maxKmh);
    return entry ? entry.multiplier : 1;
  }

  private getBuoyAndAirFallSpeed() {
    const baseFallSpeed = this.getBaseFallSpeedByKmh(this.speedKmh);
    if (!this.isSpeedBonusActive()) {
      return baseFallSpeed;
    }
    return baseFallSpeed * this.getSpeedBonusFallMultiplier(this.speedKmh);
  }

  private getLandmarkFallSpeed() {
    return this.getBaseFallSpeedByKmh(this.speedKmh);
  }

  private getObstacleSpawnDelay() {
    const baseDelay = Phaser.Math.Between(SPAWN_BASE_DELAYS.obstacleMinMs, SPAWN_BASE_DELAYS.obstacleMaxMs);
    return baseDelay * this.getObstacleSpawnMultiplier();
  }

  private getFuelSpawnDelay() {
    const baseDelay = Phaser.Math.Between(SPAWN_BASE_DELAYS.fuelMinMs, SPAWN_BASE_DELAYS.fuelMaxMs);
    return baseDelay * this.getFuelSpawnMultiplier();
  }

  private getDynamicSpawnDelay() {
    const baseDelay = Phaser.Math.Between(SPAWN_BASE_DELAYS.dynamicMinMs, SPAWN_BASE_DELAYS.dynamicMaxMs);
    return baseDelay * this.getDynamicSpawnMultiplier();
  }

  private getAirBonusSpawnDelay(type: AirBonusType) {
    const config = this.getAirBonusConfig(type);
    const baseDelay = Phaser.Math.Between(config.spawnDelayMinMs, config.spawnDelayMaxMs);
    return baseDelay * config.spawnDelayMultiplier * this.getAirBonusSpawnRangeMultiplier(type);
  }

  private getAirBonusFallSpeed(type: AirBonusType) {
    const config = this.getAirBonusConfig(type);
    return this.getBaseFallSpeedByKmh(this.speedKmh) * config.speedYMultiplier;
  }

  private getDistanceRangeIndex<T extends { minMeters: number; maxMeters: number }>(ranges: readonly T[]) {
    return ranges.findIndex((item) => this.distanceM >= item.minMeters && this.distanceM < item.maxMeters);
  }

  private getAirBonusSpawnRangeMultiplier(type: AirBonusType) {
    const ranges = type === "time" ? TIME_BONUS_SPAWN_MULTIPLIERS : SPEED_BONUS_SPAWN_MULTIPLIERS;
    const entry = ranges.find((item) => this.distanceM >= item.minMeters && this.distanceM < item.maxMeters);
    return entry ? entry.multiplier : 1;
  }

  private getObstacleSpawnMultiplier() {
    const entry = SPAWN_MULTIPLIERS.find((item) => this.distanceM >= item.minMeters && this.distanceM < item.maxMeters);
    return entry ? entry.obstacle : 1;
  }

  private getFuelSpawnMultiplier() {
    const entry = SPAWN_MULTIPLIERS.find((item) => this.distanceM >= item.minMeters && this.distanceM < item.maxMeters);
    return entry ? entry.fuel : 1;
  }

  private getDynamicSpawnMultiplier() {
    const entry = SPAWN_MULTIPLIERS.find((item) => this.distanceM >= item.minMeters && this.distanceM < item.maxMeters);
    return entry ? entry.dynamic : 1;
  }

  private getSpeedVarianceMultiplier() {
    return Phaser.Math.FloatBetween(SPEED_VARIANCE.minMultiplier, SPEED_VARIANCE.maxMultiplier);
  }

  private getDynamicBuoyStateKey(sprite: Phaser.Physics.Arcade.Sprite): DynamicBuoyStateKey {
    const stateKey = sprite.getData("dynamicStateKey") as DynamicBuoyStateKey | undefined;
    if (stateKey && stateKey in DYNAMIC_BUOY_STATES) {
      return stateKey;
    }

    const stateId = sprite.getData("dynamicState") as number | undefined;
    const entry = Object.entries(DYNAMIC_BUOY_STATES).find(([, config]) => config.stateId === stateId);
    return (entry?.[0] as DynamicBuoyStateKey | undefined) ?? DYNAMIC_BUOY_STATE_ORDER[0];
  }

  private getDynamicBuoyNoNextStateKey(
    sprite: Phaser.Physics.Arcade.Sprite,
  ): Exclude<DynamicBuoyStateKey, "no"> {
    const nextStateKey = sprite.getData("dynamicNoNextStateKey") as DynamicBuoyStateKey | undefined;
    if (nextStateKey === "up" || nextStateKey === "down") {
      return nextStateKey;
    }

    const currentStateKey = this.getDynamicBuoyStateKey(sprite);
    if (currentStateKey === "up") {
      return "down";
    }
    if (currentStateKey === "down") {
      return "up";
    }
    return Phaser.Utils.Array.GetRandom(["up", "down"]) as Exclude<DynamicBuoyStateKey, "no">;
  }

  private scheduleDynamicBuoyStateTransition(sprite: Phaser.Physics.Arcade.Sprite) {
    const stateKey = this.getDynamicBuoyStateKey(sprite);
    const stateTimer = this.time.addEvent({
      delay: DYNAMIC_BUOY_STATES[stateKey].durationMs,
      loop: false,
      callback: () => {
        if (!sprite.active || sprite.getData("collecting")) {
          return;
        }
        this.advanceDynamicBuoyState(sprite);
      },
    });
    sprite.setData("stateTimer", stateTimer);
  }

  private advanceDynamicBuoyState(sprite: Phaser.Physics.Arcade.Sprite) {
    const currentStateKey = this.getDynamicBuoyStateKey(sprite);
    let nextStateKey: DynamicBuoyStateKey;

    if (currentStateKey === "up") {
      nextStateKey = "no";
      sprite.setData("dynamicNoNextStateKey", "down");
    } else if (currentStateKey === "down") {
      nextStateKey = "no";
      sprite.setData("dynamicNoNextStateKey", "up");
    } else {
      nextStateKey = this.getDynamicBuoyNoNextStateKey(sprite);
    }

    const nextStateConfig = DYNAMIC_BUOY_STATES[nextStateKey];
    const prevWidth = sprite.displayWidth;
    const prevHeight = sprite.displayHeight;
    sprite.setData("dynamicStateKey", nextStateKey);
    sprite.setData("dynamicState", nextStateConfig.stateId);
    sprite.setTexture(nextStateConfig.textureKey);
    sprite.setDisplaySize(prevWidth, prevHeight);

    this.stopDynamicBuoyStateTimer(sprite);
    this.scheduleDynamicBuoyStateTransition(sprite);
  }

  private stopDynamicBuoyStateTimer(sprite: Phaser.Physics.Arcade.Sprite) {
    const stateTimer = sprite.getData("stateTimer") as Phaser.Time.TimerEvent | undefined;
    if (stateTimer) {
      stateTimer.remove(false);
      sprite.setData("stateTimer", undefined);
    }
  }

  private stopAllDynamicBuoyStateTimers() {
    this.dynamicBuoys?.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.stopDynamicBuoyStateTimer(sprite);
    });
  }

  private collectFuel(sprite: Phaser.Physics.Arcade.Sprite) {
    this.stopDynamicBuoyStateTimer(sprite);
    if (!this.yachtVisual) {
      this.destroyTimeBonusShadow(sprite);
      sprite.destroy();
      return;
    }

    sprite.setData("collecting", true);
    sprite.setVelocity(0, 0);
    sprite.body.enable = false;

    const startX = sprite.x;
    const startY = sprite.y;
    const baseScaleX = sprite.scaleX;
    const baseScaleY = sprite.scaleY;
    const swayOffsetX = Phaser.Math.Between(-60, 60);
    const swayOffsetY = -Phaser.Math.Between(40, 110);
    const state = { t: 0 };

    this.tweens.add({
      targets: state,
      t: 1,
      duration: 380,
      ease: "Sine.easeInOut",
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

        const scale = 1 - t;
        sprite.setScale(baseScaleX * scale, baseScaleY * scale);
        sprite.setAlpha(1 - t);

        const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
        if (shadow && shadow.active) {
          const shadowYOffset = (sprite.getData("shadowYOffset") as number | undefined) ?? TIME_BONUS.shadowYOffset;
          const shadowAlpha = (sprite.getData("shadowAlpha") as number | undefined) ?? TIME_BONUS.shadowAlpha;
          shadow.setPosition(sprite.x, sprite.y + shadowYOffset);
          shadow.setScale(scale);
          shadow.setAlpha(shadowAlpha * (1 - t));
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
      const hasActiveLockedSpeed = this.speedBonusRemainingMs > 0 && this.speedBonusLockedKmh !== undefined;
      if (!hasActiveLockedSpeed) {
        const pickupBaseSpeedKmh = this.getBaseSpeedKmhByDistance(this.distanceM);
        this.speedBonusLockedKmh = pickupBaseSpeedKmh * SPEED_BONUS.speedMultiplier;
      }
      this.speedBonusRemainingMs = SPEED_BONUS.effectDurationMs;
      this.bonusDecayActive = false;
      this.playYachtSpeedMotion("accel");
    } else {
      this.remainingTimeMs += RUN_TIMER.bonusMs;
      this.updateTimerHud();
    }
    this.collectFuel(sprite);
  }

  private destroyTimeBonusShadow(sprite: Phaser.Physics.Arcade.Sprite) {
    const shadow = sprite.getData("shadow") as Phaser.GameObjects.Image | undefined;
    if (shadow) {
      shadow.destroy();
      sprite.setData("shadow", undefined);
    }
  }

  private stopSpawnTimers() {
    this.obstacleTimer?.remove(false);
    this.fuelTimer?.remove(false);
    this.dynamicTimer?.remove(false);
    this.bonusSpawnTimer?.remove(false);
    this.obstacleTimer = undefined;
    this.fuelTimer = undefined;
    this.dynamicTimer = undefined;
    this.bonusSpawnTimer = undefined;
    this.scheduledAirBonusType = undefined;
  }

  private finishRunSuccess(reason: SuccessReason) {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.stopSpawnTimers();
    this.stopAllDynamicBuoyStateTimers();
    this.timeBonuses?.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });

    this.scene.start("Result", {
      distanceM: this.distanceM,
      coinsAwarded: this.pendingCoins,
      coinsLost: 0,
      reason,
    });
  }

  private finishRunOutOfAssets() {
    if (this.remainingTimeMs <= 0) {
      this.finishRunOutOfTime();
      return;
    }
    this.finishRunFailure("out_of_assets");
  }

  private finishRunOutOfTime() {
    this.finishRunFailure("out_of_time");
  }

  private finishRunFailure(reason: FailureReason) {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.stopSpawnTimers();
    this.stopAllDynamicBuoyStateTimers();
    this.timeBonuses?.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });

    this.scene.start("Result", {
      distanceM: this.distanceM,
      coinsAwarded: 0,
      coinsLost: this.pendingCoins,
      reason: reason as ResultReason,
    });
  }

  private resetState() {
    this.isGameOver = false;
    this.resetPointerControlState();
    this.isSpawnPauseActive = false;
    this.swayTime = 0;
    this.yMotionOffsetPx = 0;
    this.stopYachtSpeedMotionTweens();
    this.speedKmh = this.getInitialRunSpeedKmh();
    this.distanceM = 0;
    this.fuel = TUNING.FUEL_START;
    this.remainingTimeMs = RUN_TIMER.initialMs;
    this.speedBonusRemainingMs = 0;
    this.speedBonusLockedKmh = undefined;
    this.bonusDecayActive = false;
    this.hasPointerControlInput = false;
    this.lastSpawnedBonusType = undefined;
    this.sameTypeSpawnStreak = 0;
    this.scheduledAirBonusType = undefined;
    this.currentBuoySpawnRangeIndex = -1;
    this.currentTimeBonusSpawnRangeIndex = -1;
    this.currentSpeedBonusSpawnRangeIndex = -1;
    this.buoyCollisionPairLastHit.clear();
    this.buoyCollisionIdCounter = 0;

    this.pendingCoins = 0;
    this.progressStage = 0;
    this.reachedCoinMilestones.clear();
    this.spawnedLandmarks.island200 = false;
    this.spawnedLandmarks.tavern400 = false;
    this.spawnedLandmarks.harbor610 = false;

    this.stopSpawnTimers();

    this.obstacles?.clear(true, true);
    this.fuels?.clear(true, true);
    this.stopAllDynamicBuoyStateTimers();
    this.dynamicBuoys?.clear(true, true);
    this.timeBonuses?.children.each((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      this.destroyTimeBonusShadow(sprite);
    });
    this.timeBonuses?.clear(true, true);
    this.landmarks?.clear(true, true);

    this.harborGate?.destroy();
    this.harborGate = undefined;

    this.yachtBody?.destroy();
    this.yachtVisual?.destroy();
    this.yachtBody = undefined;
    this.yachtVisual = undefined;

    this.timeBar?.destroy();
    this.timeText?.destroy();
    this.timeBar = undefined;
    this.timeText = undefined;

    this.input.off("pointerdown", this.onPointerDown);
    this.input.off("pointerup", this.onPointerUp);
    this.input.off("pointerupoutside", this.onPointerUp);
    this.input.off("pointermove", this.onPointerMove);
  }
}
