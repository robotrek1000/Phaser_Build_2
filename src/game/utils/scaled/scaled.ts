import { GAME_RENDER_SCALE } from '@/constants';

export const scaled = (value: number) => {
  return value * GAME_RENDER_SCALE;
};
