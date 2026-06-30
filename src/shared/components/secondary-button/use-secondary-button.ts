import type { SecondaryButtonProps } from './secondary-button.types';

import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const useSecondaryButton = ({
  size = 'm',
  isSoundDisabled,
  onClick,
}: SecondaryButtonProps) => {
  const { playInteractionSound } = useUiInteractionSound(isSoundDisabled);

  const handleClick = () => {
    if (!onClick) {
      return;
    }

    playInteractionSound();
    onClick();
  };

  return { size, handleClick };
};
