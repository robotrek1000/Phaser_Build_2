import type { LeaveReviewRequest } from './leave-review.types';

import { delay } from '@/utils';

export const leaveReview = async (request: LeaveReviewRequest) => {
  console.log(request);
  await delay(300);
};
