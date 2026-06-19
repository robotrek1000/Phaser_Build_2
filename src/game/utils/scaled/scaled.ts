import { GAME_RENDER_SCALE } from '@/shared/constants';

export const scaled = (value: number) => {
  return value * GAME_RENDER_SCALE;
};
