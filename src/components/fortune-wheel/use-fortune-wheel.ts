import { useGame } from '@/contexts/game-context';

export const useFortuneWheel = () => {
  const game = useGame();

  return {
    collectBonus: () => game?.collectBonus('time'),
  };
};
