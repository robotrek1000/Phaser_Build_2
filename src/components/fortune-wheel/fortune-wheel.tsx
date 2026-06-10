import type { FC } from 'react';

import { useFortuneWheel } from './use-fortune-wheel';

import type { FortuneWheelProps } from './fortune-wheel.types';

import { ModalWindow } from '@/components/shared/components/modal-window';
import { SecondaryButton } from '@/components/shared/components/secondary-button';

export const FortuneWheel: FC<FortuneWheelProps> = ({
  isVisible,
  onCollectBonus,
}) => {
  const { collectBonus } = useFortuneWheel();

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
