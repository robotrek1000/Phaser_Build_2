import type { ObstacleType } from './game-obstacles-warning.types';
import type { ClientLevelNumber } from '@/shared/types';
import { getPublicAssetUrl } from '@/utils';

export const LEVELS_CONFIG: Record<
  ClientLevelNumber,
  Record<ObstacleType, { img: string; description: string }>
> = {
  1: {
    reef: {
      img: getPublicAssetUrl('textures/obstacle_lvl_1_reef.webp'),
      description: 'Корралы',
    },
    whirlpool: {
      img: getPublicAssetUrl('textures/obstacle_lvl_1_whirlpool.webp'),
      description: 'Водоворот',
    },
  },
  2: {
    reef: {
      img: getPublicAssetUrl('textures/obstacle_lvl_2_branch.webp'),
      description: 'Корралы',
    },
    whirlpool: {
      img: getPublicAssetUrl('textures/obstacle_lvl_2_whirlpool.webp'),
      description: 'Водоворот',
    },
  },
  3: {
    reef: {
      img: getPublicAssetUrl('textures/obstacle_lvl_3_ice.webp'),
      description: 'Корралы',
    },
    whirlpool: {
      img: getPublicAssetUrl('textures/obstacle_lvl_3_whirlpool.webp'),
      description: 'Водоворот',
    },
  },
};

export const OBSTACLES: ObstacleType[] = ['reef', 'whirlpool'];
