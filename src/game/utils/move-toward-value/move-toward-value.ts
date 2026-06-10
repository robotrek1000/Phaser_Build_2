export const moveTowardValue = (
  current: number,
  target: number,
  maxDelta: number
) => {
  if (current < target) {
    return Math.min(target, current + maxDelta);
  }

  if (current > target) {
    return Math.max(target, current - maxDelta);
  }

  return current;
};
