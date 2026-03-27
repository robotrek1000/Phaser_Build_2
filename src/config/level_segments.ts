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
  | "timeBonus"
  | "island1"
  | "island2"
  | "harbor"
  | "harborGate";

export type SegmentObjectDef = {
  type: SegmentObjectType;
  meterOffset: number;
  xRatio?: number;
  xOffsetPx?: number;
};

export type SegmentTemplate = {
  id: string;
  lengthMeters: number;
  weight: number;
  objects: SegmentObjectDef[];
};

export type SegmentPool = {
  id: string;
  startMeter: number;
  endMeter: number;
  templates: SegmentTemplate[];
};

const moneyUp = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "moneyUp",
  meterOffset,
  xRatio,
  xOffsetPx,
});

const timeBonus = (meterOffset: number, xRatio: number, xOffsetPx = 0): SegmentObjectDef => ({
  type: "timeBonus",
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

export const SEGMENT_POOL_SIZE_METERS = 100;
export const SEGMENT_POOL_COUNT = 12;

export const LEVEL_SEGMENT_POOLS: SegmentPool[] = [
  {
    id: "pool_0_100",
    startMeter: 0,
    endMeter: 100,
    templates: [
      {
        id: "p0_a",
        lengthMeters: 40,
        weight: 3,
        objects: [moneyUp(8, 0.3), moneyDown(20, 0.7), moneyUp(34, 0.52)],
      },
      {
        id: "p0_b",
        lengthMeters: 60,
        weight: 2,
        objects: [rock2(16, 0.14, -64), timeBonus(33, 0.52), mine(48, 0.8)],
      },
    ],
  },
  {
    id: "pool_100_200",
    startMeter: 100,
    endMeter: 200,
    templates: [
      {
        id: "p1_a",
        lengthMeters: 50,
        weight: 3,
        objects: [moneyDown(10, 0.25), moneyUp(24, 0.62), rock3(42, 0.92, 72)],
      },
      {
        id: "p1_b",
        lengthMeters: 50,
        weight: 2,
        objects: [whirlpool(12, 0.5), moneyUp(22, 0.18), dynamicBuoy(36, 0.78), timeBonus(45, 0.52)],
      },
    ],
  },
  {
    id: "pool_200_300",
    startMeter: 200,
    endMeter: 300,
    templates: [
      {
        id: "p2_a",
        lengthMeters: 40,
        weight: 3,
        objects: [pirate(14, 0.52), moneyDown(28, 0.27), moneyUp(36, 0.74)],
      },
      {
        id: "p2_b",
        lengthMeters: 60,
        weight: 2,
        objects: [rock1(8, 0.08, -76), dynamicBuoy(20, 0.76), whirlpool(38, 0.44), moneyUp(51, 0.65)],
      },
    ],
  },
  {
    id: "pool_300_400",
    startMeter: 300,
    endMeter: 400,
    templates: [
      {
        id: "p3_a",
        lengthMeters: 50,
        weight: 3,
        objects: [moneyDown(11, 0.2), pirate(27, 0.7), dynamicBuoy(39, 0.48)],
      },
      {
        id: "p3_b",
        lengthMeters: 50,
        weight: 2,
        objects: [whirlpool(10, 0.56), rock2(22, 0.88, 56), moneyDown(32, 0.3), timeBonus(46, 0.5)],
      },
    ],
  },
  {
    id: "pool_400_500",
    startMeter: 400,
    endMeter: 500,
    templates: [
      {
        id: "p4_island_left",
        lengthMeters: 100,
        weight: 2,
        objects: [
          { type: "island1", meterOffset: 8, xRatio: 0.84 },
          dynamicBuoy(24, 0.22),
          moneyDown(36, 0.5),
          whirlpool(62, 0.64),
          rock3(84, 0.08, -82),
        ],
      },
      {
        id: "p4_island_right",
        lengthMeters: 100,
        weight: 1,
        objects: [
          { type: "island1", meterOffset: 8, xRatio: 0.84 },
          pirate(26, 0.56),
          dynamicBuoy(49, 0.24),
          moneyDown(71, 0.77),
          timeBonus(90, 0.48),
        ],
      },
    ],
  },
  {
    id: "pool_500_600",
    startMeter: 500,
    endMeter: 600,
    templates: [
      {
        id: "p5_a",
        lengthMeters: 40,
        weight: 3,
        objects: [rock2(8, 0.18, -64), moneyDown(21, 0.63), whirlpool(32, 0.45)],
      },
      {
        id: "p5_b",
        lengthMeters: 60,
        weight: 2,
        objects: [pirate(10, 0.58), moneyUp(26, 0.24), dynamicBuoy(40, 0.74), timeBonus(53, 0.5)],
      },
    ],
  },
  {
    id: "pool_600_700",
    startMeter: 600,
    endMeter: 700,
    templates: [
      {
        id: "p6_a",
        lengthMeters: 50,
        weight: 3,
        objects: [whirlpool(12, 0.4), rock1(24, 0.9, 72), pirate(39, 0.53), dynamicBuoy(46, 0.26)],
      },
      {
        id: "p6_b",
        lengthMeters: 50,
        weight: 2,
        objects: [moneyDown(10, 0.27), moneyUp(21, 0.7), dynamicBuoy(31, 0.52), timeBonus(44, 0.49)],
      },
    ],
  },
  {
    id: "pool_700_800",
    startMeter: 700,
    endMeter: 800,
    templates: [
      {
        id: "p7_a",
        lengthMeters: 50,
        weight: 3,
        objects: [pirate(10, 0.24), whirlpool(22, 0.64), rock3(39, 0.11, -76), moneyDown(46, 0.55)],
      },
      {
        id: "p7_b",
        lengthMeters: 50,
        weight: 2,
        objects: [dynamicBuoy(8, 0.7), moneyUp(20, 0.32), moneyDown(33, 0.5), timeBonus(46, 0.54)],
      },
    ],
  },
  {
    id: "pool_800_900",
    startMeter: 800,
    endMeter: 900,
    templates: [
      {
        id: "p8_island_left",
        lengthMeters: 100,
        weight: 2,
        objects: [
          { type: "island2", meterOffset: 8, xRatio: 0.2 },
          dynamicBuoy(26, 0.74),
          pirate(41, 0.55),
          moneyUp(56, 0.32),
          whirlpool(83, 0.48),
        ],
      },
      {
        id: "p8_island_right",
        lengthMeters: 100,
        weight: 1,
        objects: [
          { type: "island2", meterOffset: 8, xRatio: 0.2 },
          rock2(25, 0.9, 66),
          dynamicBuoy(39, 0.48),
          moneyDown(58, 0.24),
          timeBonus(90, 0.5),
        ],
      },
    ],
  },
  {
    id: "pool_900_1000",
    startMeter: 900,
    endMeter: 1000,
    templates: [
      {
        id: "p9_a",
        lengthMeters: 40,
        weight: 3,
        objects: [dynamicBuoy(9, 0.47), pirate(22, 0.68), moneyDown(32, 0.24)],
      },
      {
        id: "p9_b",
        lengthMeters: 60,
        weight: 2,
        objects: [rock1(10, 0.1, -82), moneyDown(25, 0.78), dynamicBuoy(37, 0.55), pirate(52, 0.36)],
      },
    ],
  },
  {
    id: "pool_1000_1100",
    startMeter: 1000,
    endMeter: 1100,
    templates: [
      {
        id: "p10_a",
        lengthMeters: 50,
        weight: 3,
        objects: [pirate(9, 0.52), dynamicBuoy(21, 0.18), whirlpool(35, 0.71), moneyDown(44, 0.36)],
      },
      {
        id: "p10_b",
        lengthMeters: 50,
        weight: 2,
        objects: [rock3(9, 0.86, 64), dynamicBuoy(20, 0.55), pirate(31, 0.27), timeBonus(42, 0.5), moneyDown(47, 0.22)],
      },
    ],
  },
  {
    id: "pool_1100_1200",
    startMeter: 1100,
    endMeter: 1200,
    templates: [
      {
        id: "p11_a",
        lengthMeters: 40,
        weight: 3,
        objects: [dynamicBuoy(8, 0.22), whirlpool(18, 0.56), pirate(31, 0.7), moneyDown(36, 0.42)],
      },
      {
        id: "p11_b",
        lengthMeters: 60,
        weight: 2,
        objects: [rock2(8, 0.1, -68), pirate(22, 0.54), dynamicBuoy(35, 0.79), moneyDown(45, 0.34), timeBonus(56, 0.48)],
      },
    ],
  },
];

export const FINAL_SEGMENT_1200_1250: SegmentTemplate = {
  id: "final_1200_1250",
  lengthMeters: 50,
  weight: 1,
  objects: [
    { type: "harbor", meterOffset: 8, xRatio: 0.5 },
    { type: "harborGate", meterOffset: 20, xRatio: 0.5 },
  ],
};
