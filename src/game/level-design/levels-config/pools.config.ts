import {
  dynamicBuoy,
  moneyDown,
  moneyUp,
  reef,
  wheelIsland,
  whirlpool,
} from '../utils/make-objects';

export const GREEN_PARADISE_P1 = [
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
];

export const GREEN_PARADISE_P6 = [
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
];

export const GREEN_PARADISE_P10 = [
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
];

export const RED_HELL_50 = [
  moneyDown(5, 0.2),
  moneyDown(13, 0.38),
  moneyDown(21, 0.56),
  moneyDown(29, 0.74),
  moneyDown(37, 0.56),
  moneyDown(45, 0.34),
];

export const DYNAMIC_HELL_50 = [
  dynamicBuoy(6, 0.22),
  dynamicBuoy(14, 0.4),
  dynamicBuoy(22, 0.58),
  dynamicBuoy(30, 0.76),
  moneyDown(38, 0.36),
  moneyDown(46, 0.64),
];

export const GREEN_RED_MIX_50 = [
  moneyUp(6, 0.25),
  moneyDown(12, 0.58),
  moneyUp(18, 0.42),
  moneyDown(24, 0.72),
  reef(30, 0.14, -52),
  moneyUp(36, 0.6),
  moneyDown(42, 0.3),
];

export const GREEN_RED_MIX_100 = [
  moneyUp(8, 0.2),
  moneyDown(16, 0.62),
  moneyUp(24, 0.4),
  moneyDown(32, 0.76),
  reef(40, 0.88, 58),
  moneyUp(50, 0.3),
  moneyDown(60, 0.68),
  moneyUp(70, 0.48),
  moneyDown(80, 0.24),
];

export const MINEFIELD_50 = [
  moneyDown(6, 0.2),
  moneyDown(15, 0.62),
  moneyDown(24, 0.4),
  moneyDown(33, 0.78),
  moneyDown(42, 0.52),
];

export const WHIRLPOOL_CLUSTER_50 = [
  whirlpool(6, 0.3),
  whirlpool(14, 0.68),
  whirlpool(22, 0.46),
  whirlpool(30, 0.62),
  whirlpool(38, 0.34),
  whirlpool(46, 0.56),
];

export const ROCKY_CANYON_50 = [
  reef(6, 0.1, -78),
  reef(14, 0.88, 74),
  reef(22, 0.52),
  moneyDown(30, 0.32),
  moneyUp(36, 0.7),
  whirlpool(42, 0.5),
];

export const ROCKY_CANYON_100 = [
  reef(8, 0.1, -82),
  reef(18, 0.9, 70),
  moneyUp(28, 0.28),
  reef(38, 0.52),
  moneyDown(48, 0.72),
  whirlpool(54, 0.45),
  reef(68, 0.12, -82),
  moneyDown(78, 0.32),
];

export const PIRATES_AND_MINES_50 = [
  moneyDown(6, 0.24),
  moneyDown(14, 0.62),
  moneyDown(22, 0.46),
  moneyDown(30, 0.3),
  moneyDown(46, 0.52),
];

export const PIRATES_AND_MINES_100 = [
  moneyDown(8, 0.2),
  moneyDown(18, 0.58),
  moneyDown(28, 0.34),
  moneyDown(38, 0.74),
  moneyDown(48, 0.44),
  moneyDown(58, 0.22),
  moneyDown(78, 0.52),
];

export const RISK_CHASE_50 = [
  reef(6, 0.1, -78),
  whirlpool(20, 0.46),
  reef(34, 0.9, 72),
  whirlpool(46, 0.5),
];

export const RISK_CHASE_100 = [
  reef(8, 0.1, -82),
  whirlpool(20, 0.42),
  whirlpool(30, 0.58),
  reef(42, 0.9, 74),
  whirlpool(58, 0.48),
  reef(76, 0.12, -76),
  whirlpool(88, 0.5),
];

export const LANE_SLALOM_50 = [
  reef(7, 0.12, -72),
  moneyUp(14, 0.42),
  moneyDown(21, 0.64),
  reef(28, 0.88, 66),
  moneyUp(35, 0.32),
  moneyDown(42, 0.56),
];

export const STAGGERED_CROSS_50 = [
  moneyDown(6, 0.24),
  dynamicBuoy(12, 0.74),
  moneyDown(18, 0.44),
  moneyUp(24, 0.28),
  dynamicBuoy(30, 0.62),
];

export const DUAL_RISK_DUAL_REWARD_100 = [
  moneyDown(10, 0.24),
  moneyDown(20, 0.68),
  moneyUp(30, 0.38),
  moneyDown(40, 0.58),
  moneyDown(50, 0.72),
  moneyDown(60, 0.3),
  moneyUp(70, 0.62),
];

export const CENTER_PRESSURE_50 = [
  whirlpool(8, 0.5),
  moneyDown(16, 0.5),
  reef(24, 0.14, -62),
  reef(32, 0.86, 62),
  moneyUp(40, 0.5),
];

export const EDGE_PRESSURE_100 = [
  reef(10, 0.08, -82),
  moneyDown(20, 0.2),
  dynamicBuoy(30, 0.8),
  moneyDown(40, 0.24),
  reef(50, 0.92, 70),
  dynamicBuoy(70, 0.22),
  moneyUp(80, 0.74),
];

export const ZIGZAG_BUOYS_50 = [
  moneyUp(6, 0.2),
  moneyDown(12, 0.34),
  moneyUp(18, 0.48),
  moneyDown(24, 0.62),
  moneyUp(30, 0.76),
  moneyDown(36, 0.62),
  moneyUp(42, 0.48),
  moneyDown(48, 0.34),
];

export const BONUS_CORRIDOR_100 = [
  moneyUp(10, 0.28),
  moneyUp(40, 0.72),
  moneyDown(90, 0.74),
  reef(98, 0.12, -70),
];

export const ROCK_GATE_MIX_50 = [
  reef(8, 0.16, -66),
  reef(16, 0.84, 62),
  moneyDown(24, 0.52),
  moneyUp(32, 0.36),
  whirlpool(40, 0.64),
];

export const SPIRAL_AVOID_100 = [
  whirlpool(10, 0.5),
  moneyDown(20, 0.26),
  moneyDown(30, 0.72),
  moneyDown(50, 0.6),
  moneyDown(60, 0.76),
  moneyDown(70, 0.3),
  whirlpool(80, 0.56),
  moneyUp(90, 0.42),
];

export const LATE_REACTION_50 = [
  moneyUp(6, 0.24),
  moneyDown(14, 0.66),
  dynamicBuoy(22, 0.34),
  moneyDown(30, 0.74),
];

export const ORDINARY_FILLER_50 = [
  moneyUp(8, 0.28),
  moneyDown(16, 0.62),
  reef(24, 0.12, -64),
  reef(32, 0.88, 64),
];

export const SKILL_WHEEL_ISLAND_EARTH1_50 = [wheelIsland(25, 0.5)];
