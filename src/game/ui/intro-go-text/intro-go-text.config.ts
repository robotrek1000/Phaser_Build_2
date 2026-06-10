export const INTRO_GO_TEXT_CONFIG = {
  text: 'ВПЕРЁД!',
  depth: 260,
  style: {
    fontFamily: 'Fascinate',
    fontSize: 59,
    fontStyle: 'bold',
    color: '#FFFFFF',
    align: 'center',
  },
  position: {
    xRatio: 0.5,
    yRatio: 0.5,
  },
  animation: {
    showDelayMs: 0,
    hopUpPx: 53,
    hopUpDurationMs: 260,
    settleDurationMs: 140,
    holdDurationMs: 800,
    scaleFrom: 1,
    scaleInTo: 1.18,
    scaleOutTo: 0.92,
    scaleInEase: 'Cubic.easeOut',
    settleEase: 'Sine.easeOut',
    scaleOutEase: 'Cubic.easeIn',
    outDurationMs: 220,
  },
} as const;
