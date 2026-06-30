import { useMutation } from '@tanstack/react-query';

import type { LeaveReviewRequest } from '@/shared/api';

import { leaveReview as leaveReviewApiFn } from '@/shared/api';

export const useLeaveView = (onSuccess?: () => void) => {
  const { mutate, isPending } = useMutation({
    mutationFn: leaveReviewApiFn,
    onSuccess,
  });

  const leaveReview = (request: LeaveReviewRequest) => {
    mutate(request);
  };

  return {
    isPending,
    leaveReview,
  };
};
