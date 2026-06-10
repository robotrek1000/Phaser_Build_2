import type { GameResultsProps } from './game-results.types';
import type { ModalWindowProps } from '@/components/shared/components/modal-window';
import type { GameFinishPayload } from '@/game/game.types';

import whiteCup from '@/assets/cup-white.svg';
import whiteFlag from '@/assets/flag-white.svg';

const getModalWindowProps = (
  gameResults?: GameFinishPayload
): Pick<ModalWindowProps, 'topGradient' | 'sailorType'> => {
  if (!gameResults) {
    return {};
  }

  const { isAtPort, distance } = gameResults;

  if (isAtPort) {
    return {
      sailorType: 'happy',
      topGradient: 'green',
    };
  }

  if (distance < 500) {
    return {
      sailorType: 'sad',
      topGradient: 'orange',
    };
  }

  return {
    sailorType: 'normal',
    topGradient: 'blue',
  };
};

const getDistanceIcon = (gameResults?: GameFinishPayload) => {
  return gameResults?.isAtPort ? whiteCup : whiteFlag;
};

const getText = (gameResults?: GameFinishPayload) => {
  if (!gameResults) {
    return '';
  }

  const { isAtPort, distance } = gameResults;

  if (isAtPort) {
    return 'Вы допстигли бухты!';
  }

  if (distance < 500) {
    return 'В следующий раз повезет!';
  }

  return 'Почти получилось!';
};

export const useGameResults = ({ gameResults }: GameResultsProps) => {
  return {
    isWin: true,
    modalWindowProps: getModalWindowProps(gameResults),
    distance: Math.trunc(gameResults?.distance ?? 0),
    totalDistance: Math.trunc(gameResults?.totalDistance ?? 1),
    distanceIcon: getDistanceIcon(gameResults),
    text: getText(gameResults),
  };
};
