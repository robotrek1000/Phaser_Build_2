import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGame } from '@/contexts/game-context';
import { CLIENT_PROFILE_QUERY_KEY } from '@/hooks/use-client-profile';
import { finishGameSession as finishGameSessionApiFn } from '@/shared/api/finish-game-session';

export const useFinishGameSession = () => {
  const game = useGame();

  if (!game) {
    throw new Error('Game is not defined');
  }

  const queryClient = useQueryClient();

  const { mutate, isPending, data } = useMutation({
    mutationFn: finishGameSessionApiFn,
    onSuccess: async () => {
      game.resetSessionId();

      await queryClient.invalidateQueries({
        queryKey: CLIENT_PROFILE_QUERY_KEY,
      });
    },
  });

  return {
    finishGameSession: mutate,
    isPending,
    data,
  };
};
