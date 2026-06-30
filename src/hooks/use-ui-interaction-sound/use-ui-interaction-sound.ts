import { useGame } from '@/contexts/game-context';

export const useUiInteractionSound = (isDisabled = false) => {
  const game = useGame();

  const soundManager = game?.soundManager;

  const playInteractionSound = () => {
    if (isDisabled) {
      return;
    }

    soundManager?.playRandomSound(['select1', 'select2']);
  };

  const playSwipeSound = () => {
    if (isDisabled) {
      return;
    }

    soundManager?.playSound('drop1');
  };

  return {
    playInteractionSound,
    playSwipeSound,
  };
};
