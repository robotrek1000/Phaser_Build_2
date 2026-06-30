import type { FC } from 'react';

import { BonusWheelModalWindow } from './components/bonus-wheel-modal-window';
import { BonusWheelResult } from './components/bonus-wheel-result';
import { BonusWheelVisualization } from './components/bonus-wheel-visualization';
import { useBonusWheel } from './use-bonus-wheel.ts';

import type { BonusWheelProps } from './bonus-wheel.types.ts';

import { Backdrop } from '@/shared/components/backdrop';

export const BonusWheel: FC<BonusWheelProps> = (props) => {
  const {
    bonus,
    bonusMultiplier,
    bonusValue,
    pointerElementRef,
    handleStopButtonClick,
    handleContinueButtonClick,
  } = useBonusWheel(props);

  return (
    <>
      <Backdrop isVisible={props.isVisible} />

      <BonusWheelModalWindow
        isVisible={props.isVisible && !bonus}
        onStopButtonClick={handleStopButtonClick}
      >
        <BonusWheelVisualization
          ref={pointerElementRef}
          bonus={bonus}
        />
      </BonusWheelModalWindow>

      {bonus && (
        <BonusWheelResult
          bonus={bonus}
          bonusMultiplier={bonusMultiplier}
          bonusValue={bonusValue}
          onContinueButtonClick={handleContinueButtonClick}
        />
      )}
    </>
  );
};
