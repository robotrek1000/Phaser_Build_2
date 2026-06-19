import type { ModalWindowProps } from '@/shared/components/modal-window/modal-window.types';
import type { SailorPictureVariant } from '@/shared/components/sailor-picture';

export interface SailorModalProps extends ModalWindowProps {
  sailorType: SailorPictureVariant;
}
