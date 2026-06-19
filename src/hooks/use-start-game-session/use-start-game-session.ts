import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useGame } from '@/contexts/game-context';
import { startGameSession as startGameSessionApiFn } from '@/shared/api';

export const useStartGameSession = (onSuccess: () => void) => {
  const game = useGame();

  const { mutate, isPending } = useMutation({
    mutationFn: startGameSessionApiFn,
    onSuccess: ({ sessionId }) => {
      game?.setSessionId(sessionId);
      onSuccess();
    },
  });

  const startGameSession = useCallback(
    (isFreeStart: boolean) => {
      mutate({ levelId: game?.getSettings()?.level ?? 1, isFreeStart });
    },
    [game, mutate]
  );

  return {
    isPending,
    startGameSession,
  };
};
