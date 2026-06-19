import type { ModalWindowProps } from '@/shared/components/modal-window';
import type { ClientYachtType } from '@/shared/types';
import type {
  MotionNodeAnimationOptions,
  MotionNodeDraggableOptions,
} from 'motion-dom';

import yachtSkinDefault from '@/assets/skin_change_1.png';
import yachtSkinGold from '@/assets/skin_change_2.png';

export const SLIDER_ANIMATION_CONFIG = (
  activeIndex: number
): MotionNodeAnimationOptions => ({
  animate: {
    x: `calc(${activeIndex} * -1 * 100%)`,
  },
  transition: { duration: 0.3 },
});

export const SLIDE_ANIMATION_CONFIG = (
  isActive: boolean
): MotionNodeAnimationOptions => ({
  animate: {
    opacity: isActive ? 1 : 0.5,
  },
  transition: { duration: 0.3 },
});

export const SLIDE_DRAG_CONFIG: MotionNodeDraggableOptions = {
  drag: 'x',
  dragConstraints: { left: 10, right: 10 },
  dragElastic: 0.1,
};

export const SKINS_CONFIG: Record<ClientYachtType, string> = {
  Gold: yachtSkinGold,
  Normal: yachtSkinDefault,
};

export const MODAL_PROPS_CONFIG: Record<
  ClientYachtType,
  Partial<ModalWindowProps>
> = {
  Gold: {
    topGradient: 'yellow',
  },
  Normal: {
    topGradient: 'blue',
  },
};
