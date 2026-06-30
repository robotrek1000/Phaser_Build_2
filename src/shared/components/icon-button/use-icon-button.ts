import { ICON } from './icon-button.constants';

import type { IconButtonProps } from './icon-button.types';

import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';

export const useIconButton = ({
  icon,
  isSoundDisabled,
  onClick,
}: IconButtonProps) => {
  const { playInteractionSound } = useUiInteractionSound(isSoundDisabled);

  const handleClick = () => {
    if (!onClick) {
      return;
    }

    playInteractionSound();
    onClick();
  };

  return { Icon: ICON[icon], handleClick };
};
