import { useEffect } from 'react';

import type { GameResultsProps } from './game-results.types';
import type { GameSessionResult } from '@/shared/api/finish-game-session';
import type { SailorModalProps } from '@/shared/components/sailor-modal';

import { useGame } from '@/contexts/game-context';

const getModalWindowProps = (
  gameResults?: GameSessionResult
): Pick<SailorModalProps, 'topGradient' | 'sailorType'> => {
  switch (gameResults?.type) {
    case 'Good':
      return {
        sailorType: 'happy',
        topGradient: 'green',
      };
    case 'Bad':
      return {
        sailorType: 'sad',
        topGradient: 'orange',
      };
    default:
      return {
        sailorType: 'normal',
        topGradient: 'blue',
      };
  }
};

export const useGameResults = ({ gameResults }: GameResultsProps) => {
  const game = useGame();

  const soundManager = game?.soundManager;

  const isWin = gameResults?.type === 'Good';

  useEffect(() => {
    if (isWin) {
      soundManager?.playSound('chords1');
    }
  }, [isWin, soundManager]);

  return {
    isWin,
    modalWindowProps: getModalWindowProps(gameResults),
  };
};
