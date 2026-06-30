import type { Rating } from '@/shared/types';

export interface LeaveReviewRequest {
  rating: Rating;
  feedback?: string;
}
