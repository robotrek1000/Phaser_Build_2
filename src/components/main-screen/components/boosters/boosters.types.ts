import type { ModalWindowProps } from '@/shared/components/modal-window';

export interface BoosterConfig {
  img: string;
  modalProps: Pick<ModalWindowProps, 'variant' | 'topGradient'>;
}

export interface BoostersProps {
  className?: string;
}
