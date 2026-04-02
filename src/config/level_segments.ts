export type SegmentObjectType =
  | "mine"
  | "pirate"
  | "moneyDown"
  | "dynamicBuoy"
  | "whirlpool"
  | "rock1"
  | "rock2"
  | "rock3"
  | "moneyUp"
  | "coin"
  | "speedBonus"
  | "timeBonus"
  | "harbor"
  | "harborGate";

export type SegmentObjectDef = {
  type: SegmentObjectType;
  meterOffset: number;
  xRatio?: number;
  xOffsetPx?: number;
};

export type SegmentLengthMeters = 50 | 100;

export type SegmentPoolStage = "early" | "mid" | "late" | "endgame";

export type SegmentTemplate = {
  id: string;
  patternId: string;
  lengthMeters: SegmentLengthMeters;
  baseWeight: number;
  weightByPoolStage?: Partial<Record<SegmentPoolStage, number>>;
  poolWindow: {
    poolIndexFrom: number;
    poolIndexTo: number;
  };
  maxPoolsPerRun?: number;
  objects: SegmentObjectDef[];
};

export type SegmentPool = {
  id: string;
  poolIndex: number;
  startMeter: number;
  endMeter: number;
};

const moneyUp = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "moneyUp",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const moneyDown = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "moneyDown",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const dynamicBuoy = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "dynamicBuoy",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const mine = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "mine",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const pirate = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "pirate",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const whirlpool = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "whirlpool",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const rock1 = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "rock1",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const rock2 = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "rock2",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const rock3 = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "rock3",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const coin = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "coin",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const tpl = (
  id: string,
  patternId: string,
  lengthMeters: SegmentLengthMeters,
  baseWeight: number,
  poolIndexFrom: number,
  poolIndexTo: number,
  objects: SegmentObjectDef[],
  maxPoolsPerRun?: number,
  weightByPoolStage?: Partial<Record<SegmentPoolStage, number>>,
): SegmentTemplate => ({
  id,
  patternId,
  lengthMeters,
  baseWeight,
  poolWindow: { poolIndexFrom, poolIndexTo },
  maxPoolsPerRun,
  weightByPoolStage,
  objects,
});

export const SEGMENT_POOL_SIZE_METERS = 100;
export const SEGMENT_POOL_COUNT = 12;

export const LEVEL_SEGMENT_POOLS: SegmentPool[] = Array.from({ length: SEGMENT_POOL_COUNT }, (_, i) => {
  const startMeter = i * SEGMENT_POOL_SIZE_METERS;
  const endMeter = startMeter + SEGMENT_POOL_SIZE_METERS;
  return {
    id: `pool_${startMeter}_${endMeter}`,
    poolIndex: i + 1,
    startMeter,
    endMeter,
  };
});

export const SEGMENT_TEMPLATE_CATALOG: SegmentTemplate[] = [
  tpl(
    "green_paradise_p1",
    "green_paradise",
    50,
    1,
    1,
    1,
    [
      moneyUp(4, 0.2),
      moneyUp(8, 0.35),
      moneyUp(12, 0.5),
      moneyUp(16, 0.65),
      moneyUp(20, 0.8),
      moneyUp(24, 0.65),
      moneyUp(28, 0.5),
      moneyUp(32, 0.35),
      moneyUp(40, 0.22),
      moneyUp(48, 0.78),
    ],
    3,
  ),
  tpl(
    "green_paradise_p6",
    "green_paradise",
    50,
    1,
    6,
    6,
    [
      moneyUp(4, 0.24),
      moneyUp(8, 0.42),
      moneyUp(12, 0.6),
      moneyUp(16, 0.78),
      moneyUp(20, 0.6),
      moneyUp(24, 0.42),
      moneyUp(28, 0.24),
      moneyUp(34, 0.5),
      moneyUp(40, 0.32),
      moneyUp(47, 0.68),
    ],
    3,
  ),
  tpl(
    "green_paradise_p10",
    "green_paradise",
    50,
    1,
    10,
    10,
    [
      moneyUp(5, 0.22),
      moneyUp(9, 0.4),
      moneyUp(13, 0.58),
      moneyUp(17, 0.76),
      moneyUp(21, 0.58),
      moneyUp(25, 0.4),
      moneyUp(29, 0.22),
      moneyUp(35, 0.5),
      moneyUp(41, 0.3),
      moneyUp(48, 0.7),
    ],
    3,
  ),
  tpl(
    "red_hell_50",
    "red_hell",
    50,
    1,
    3,
    12,
    [
      moneyDown(4, 0.16),
      moneyDown(8, 0.3),
      moneyDown(12, 0.44),
      moneyDown(16, 0.58),
      moneyDown(20, 0.72),
      moneyDown(24, 0.86),
      moneyDown(30, 0.72),
      moneyDown(36, 0.58),
      moneyDown(42, 0.44),
      moneyDown(48, 0.3),
    ],
    2,
    { early: 0.6, mid: 1, late: 1.3, endgame: 1.5 },
  ),
  tpl(
    "dynamic_hell_50",
    "dynamic_hell",
    50,
    1,
    3,
    12,
    [
      dynamicBuoy(5, 0.2),
      dynamicBuoy(10, 0.34),
      dynamicBuoy(15, 0.48),
      dynamicBuoy(20, 0.62),
      dynamicBuoy(25, 0.76),
      dynamicBuoy(30, 0.62),
      dynamicBuoy(35, 0.48),
      dynamicBuoy(40, 0.34),
      moneyDown(45, 0.2),
      moneyDown(49, 0.8),
    ],
    2,
    { early: 0.7, mid: 1, late: 1.2, endgame: 1.35 },
  ),
  tpl(
    "green_red_mix_50",
    "green_red_mix",
    50,
    2,
    1,
    3,
    [
      moneyUp(6, 0.25),
      moneyDown(12, 0.58),
      moneyUp(18, 0.42),
      moneyDown(24, 0.72),
      rock1(30, 0.14, -52),
      moneyUp(36, 0.6),
      moneyDown(42, 0.3),
    ],
    undefined,
    { early: 1.2, mid: 1, late: 0.65, endgame: 0.5 },
  ),
  tpl(
    "green_red_mix_100",
    "green_red_mix",
    100,
    2,
    1,
    3,
    [
      moneyUp(8, 0.2),
      moneyDown(16, 0.62),
      moneyUp(24, 0.4),
      moneyDown(32, 0.76),
      rock2(40, 0.88, 58),
      moneyUp(50, 0.3),
      moneyDown(60, 0.68),
      moneyUp(70, 0.48),
      moneyDown(80, 0.24),
    ],
    undefined,
    { early: 1.1, mid: 1, late: 0.55, endgame: 0.4 },
  ),
  tpl(
    "minefield_50",
    "minefield",
    50,
    1,
    6,
    12,
    [
      mine(5, 0.18),
      mine(10, 0.34),
      mine(15, 0.5),
      mine(20, 0.66),
      mine(25, 0.82),
      mine(30, 0.66),
      mine(35, 0.5),
      mine(40, 0.34),
      mine(45, 0.18),
      mine(49, 0.82),
    ],
    2,
    { early: 0.2, mid: 0.9, late: 1.3, endgame: 1.45 },
  ),
  tpl(
    "whirlpool_cluster_50",
    "whirlpool_cluster",
    50,
    1,
    6,
    12,
    [
      whirlpool(6, 0.28),
      whirlpool(12, 0.5),
      whirlpool(18, 0.72),
      whirlpool(24, 0.36),
      whirlpool(30, 0.64),
      whirlpool(36, 0.48),
      whirlpool(42, 0.26),
      whirlpool(48, 0.74),
    ],
    2,
    { early: 0.2, mid: 0.85, late: 1.25, endgame: 1.35 },
  ),
  tpl(
    "rocky_canyon_50",
    "rocky_canyon",
    50,
    2,
    2,
    12,
    [
      rock1(6, 0.1, -78),
      rock2(14, 0.88, 74),
      rock3(22, 0.52),
      moneyDown(30, 0.32),
      moneyUp(36, 0.7),
      whirlpool(42, 0.5),
      coin(48, 0.24),
    ],
    3,
    { early: 1, mid: 1.05, late: 1.1, endgame: 1 },
  ),
  tpl(
    "rocky_canyon_100",
    "rocky_canyon",
    100,
    2,
    2,
    12,
    [
      rock1(8, 0.1, -82),
      rock2(18, 0.9, 70),
      moneyUp(28, 0.28),
      rock3(38, 0.52),
      moneyDown(48, 0.72),
      whirlpool(58, 0.45),
      rock1(68, 0.12, -82),
      moneyDown(78, 0.32),
      coin(88, 0.68),
    ],
    3,
    { early: 1, mid: 1.05, late: 1.15, endgame: 1.05 },
  ),
  tpl(
    "pirates_and_mines_50",
    "pirates_and_mines",
    50,
    2,
    4,
    12,
    [
      mine(6, 0.24),
      pirate(14, 0.62),
      mine(22, 0.46),
      moneyDown(30, 0.3),
      pirate(38, 0.72),
      mine(46, 0.52),
    ],
    2,
    { early: 0, mid: 1, late: 1.15, endgame: 1.2 },
  ),
  tpl(
    "pirates_and_mines_100",
    "pirates_and_mines",
    100,
    2,
    4,
    12,
    [
      mine(8, 0.2),
      pirate(18, 0.58),
      moneyDown(28, 0.34),
      mine(38, 0.74),
      pirate(48, 0.44),
      mine(58, 0.22),
      pirate(68, 0.66),
      moneyDown(78, 0.52),
      mine(88, 0.78),
    ],
    2,
    { early: 0, mid: 1, late: 1.15, endgame: 1.25 },
  ),
  tpl(
    "risk_chase_50",
    "risk_chase_whirlpool_rocks_coins",
    50,
    1,
    8,
    12,
    [
      rock1(6, 0.1, -78),
      whirlpool(14, 0.46),
      coin(16, 0.36),
      whirlpool(24, 0.54),
      coin(26, 0.64),
      rock2(34, 0.9, 72),
      whirlpool(40, 0.5),
      coin(44, 0.58),
      moneyDown(48, 0.3),
    ],
    2,
    { early: 0, mid: 0.6, late: 1.25, endgame: 1.5 },
  ),
  tpl(
    "risk_chase_100",
    "risk_chase_whirlpool_rocks_coins",
    100,
    1,
    8,
    12,
    [
      rock1(8, 0.1, -82),
      whirlpool(18, 0.42),
      coin(20, 0.34),
      whirlpool(30, 0.58),
      coin(32, 0.66),
      rock2(42, 0.9, 74),
      whirlpool(52, 0.48),
      coin(54, 0.38),
      whirlpool(64, 0.62),
      coin(66, 0.7),
      rock3(76, 0.12, -76),
      whirlpool(86, 0.5),
      coin(88, 0.56),
      moneyDown(96, 0.26),
    ],
    2,
    { early: 0, mid: 0.5, late: 1.2, endgame: 1.45 },
  ),
  tpl(
    "lane_slalom_50",
    "lane_slalom",
    50,
    3,
    2,
    12,
    [
      rock1(7, 0.12, -72),
      moneyUp(14, 0.42),
      moneyDown(21, 0.64),
      rock2(28, 0.88, 66),
      moneyUp(35, 0.32),
      moneyDown(42, 0.56),
    ],
  ),
  tpl(
    "staggered_cross_50",
    "staggered_cross",
    50,
    3,
    3,
    12,
    [
      moneyDown(6, 0.24),
      dynamicBuoy(12, 0.74),
      mine(18, 0.44),
      moneyUp(24, 0.28),
      dynamicBuoy(30, 0.62),
      moneyDown(36, 0.4),
    ],
  ),
  tpl(
    "dual_risk_dual_reward_100",
    "dual_risk_dual_reward",
    100,
    2,
    4,
    12,
    [
      pirate(10, 0.24),
      mine(20, 0.68),
      moneyUp(30, 0.38),
      moneyDown(40, 0.58),
      pirate(50, 0.72),
      mine(60, 0.3),
      moneyUp(70, 0.62),
      moneyDown(80, 0.42),
    ],
  ),
  tpl(
    "center_pressure_50",
    "center_pressure",
    50,
    3,
    2,
    12,
    [
      whirlpool(8, 0.5),
      moneyDown(16, 0.5),
      rock3(24, 0.14, -62),
      rock2(32, 0.86, 62),
      moneyUp(40, 0.5),
      coin(48, 0.72),
    ],
  ),
  tpl(
    "edge_pressure_100",
    "edge_pressure",
    100,
    2,
    3,
    12,
    [
      rock1(10, 0.08, -82),
      mine(20, 0.2),
      dynamicBuoy(30, 0.8),
      moneyDown(40, 0.24),
      rock2(50, 0.92, 70),
      mine(60, 0.78),
      dynamicBuoy(70, 0.22),
      moneyUp(80, 0.74),
    ],
  ),
  tpl(
    "zigzag_buoys_50",
    "zigzag_buoys",
    50,
    3,
    2,
    12,
    [
      moneyUp(6, 0.2),
      moneyDown(12, 0.34),
      moneyUp(18, 0.48),
      moneyDown(24, 0.62),
      moneyUp(30, 0.76),
      moneyDown(36, 0.62),
      moneyUp(42, 0.48),
      moneyDown(48, 0.34),
    ],
    undefined,
    { early: 1, mid: 1.05, late: 1.15, endgame: 1.2 },
  ),
  tpl(
    "bonus_corridor_100",
    "bonus_corridor",
    100,
    2,
    2,
    12,
    [
      moneyUp(10, 0.28),
      moneyUp(40, 0.72),
      coin(50, 0.3),
      coin(80, 0.54),
      moneyDown(90, 0.74),
      rock3(98, 0.12, -70),
    ],
  ),
  tpl(
    "rock_gate_mix_50",
    "rock_gate_mix",
    50,
    3,
    2,
    12,
    [
      rock1(8, 0.16, -66),
      rock2(16, 0.84, 62),
      moneyDown(24, 0.52),
      moneyUp(32, 0.36),
      whirlpool(40, 0.64),
      coin(48, 0.5),
    ],
  ),
  tpl(
    "spiral_avoid_100",
    "spiral_avoid",
    100,
    2,
    4,
    12,
    [
      whirlpool(10, 0.5),
      mine(20, 0.26),
      pirate(30, 0.72),
      whirlpool(40, 0.38),
      moneyDown(50, 0.6),
      mine(60, 0.76),
      pirate(70, 0.3),
      whirlpool(80, 0.56),
      moneyUp(90, 0.42),
    ],
  ),
  tpl(
    "late_reaction_50",
    "late_reaction",
    50,
    3,
    3,
    12,
    [
      moneyUp(6, 0.24),
      mine(14, 0.66),
      dynamicBuoy(22, 0.34),
      moneyDown(30, 0.74),
      pirate(38, 0.5),
    ],
  ),
  tpl(
    "ordinary_filler_50",
    "ordinary_filler",
    50,
    3,
    1,
    12,
    [
      moneyUp(8, 0.28),
      moneyDown(16, 0.62),
      rock1(24, 0.12, -64),
      rock2(32, 0.88, 64),
    ],
  ),
];

export const FINAL_SEGMENT_1200_1250: SegmentTemplate = {
  id: "final_1200_1250",
  patternId: "final_harbor",
  lengthMeters: 50,
  baseWeight: 1,
  poolWindow: { poolIndexFrom: 12, poolIndexTo: 12 },
  objects: [
    { type: "harbor", meterOffset: 50, xRatio: 0.5 },
    { type: "harborGate", meterOffset: 50, xRatio: 0.5 },
  ],
};
