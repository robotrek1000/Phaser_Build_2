import type { GameResultsProps } from './game-results.types';
import type { GameSessionResult } from '@/shared/api/finish-game-session';
import type { SailorModalProps } from '@/shared/components/sailor-modal';

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
  return {
    modalWindowProps: getModalWindowProps(gameResults),
  };
};
