import type { FC } from 'react';

import type { FortuneWheelProps } from './fortune-wheel.types';

import { ModalWindow } from '@/components/shared/components/modal-window';
import { SecondaryButton } from '@/components/shared/components/secondary-button';

export const FortuneWheel: FC<FortuneWheelProps> = ({
  isVisible,
  onCollectBonus,
}) => {
  return (
    <ModalWindow
      isOpen={isVisible}
      variant="blue"
      sailorType="lookingFar"
      footer={
        <SecondaryButton onClick={() => onCollectBonus('time')}>
          OK
        </SecondaryButton>
      }
    ></ModalWindow>
  );
};
