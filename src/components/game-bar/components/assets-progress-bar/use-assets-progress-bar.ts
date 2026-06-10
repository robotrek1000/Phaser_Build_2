import { useEffect, useState } from 'react';

import styles from './assets-progress-bar.module.css';

import type { GameStateUpdatePayload } from '@/game/game.types';

import { useGame } from '@/contexts/game-context';
import { GAME_EVENT_GAME_STATE_UPDATE } from '@/game';

const getProgressStyle = (progress: number) => {
  if (progress >= 0.75) {
    return {
      iconClassName: styles.iconGreen,
      gradient: {
        from: '#00EFDF',
        to: '#08EE00',
      },
    };
  }
  if (progress < 0.25) {
    return {
      iconClassName: styles.iconRed,
      gradient: {
        from: '#EE2400',
        to: '#EF7C00',
      },
    };
  }

  return {
    iconClassName: styles.iconYellow,
    gradient: {
      from: '#EF7C00',
      to: '#EEC200',
    },
  };
};

export const useAssetsProgressBar = () => {
  const game = useGame();

  const [assetsProgress, setAssetsProgress] = useState(0.5);

  const [assetsCapacity, setCapacity] = useState(1);

  const progress = assetsProgress / assetsCapacity;

  useEffect(() => {
    if (game) {
      const unsubscribeGameStateUpdate = game.on(
        GAME_EVENT_GAME_STATE_UPDATE,
        (payload) => {
          const { assetsProgress, assetsCapacity } =
            payload as GameStateUpdatePayload;

          setAssetsProgress(assetsProgress);
          setCapacity(assetsCapacity);
        }
      );

      return () => {
        unsubscribeGameStateUpdate();
      };
    }
  }, [game]);

  return {
    progress,
    widthScale: assetsCapacity,
    ...getProgressStyle(progress),
  };
};
