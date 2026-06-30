import type { PrimaryButtonProps } from './primary-button.types';

import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const usePrimaryButton = ({
  disabled,
  isPending,
  isSoundDisabled,
  onClick,
}: PrimaryButtonProps) => {
  const { playInteractionSound } = useUiInteractionSound(isSoundDisabled);

  const handleClick = () => {
    if (disabled || isPending || !onClick) {
      return;
    }

    playInteractionSound();
    onClick();
  };

  return { handleClick };
};
