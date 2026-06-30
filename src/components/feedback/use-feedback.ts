import { useRef, useState } from 'react';

import type { FeedbackProps } from './feedback.types';
import type { Rating } from '@/shared/types';

import { useLeaveView } from '@/hooks/use-leave-review';

export const useFeedback = ({ onClose }: FeedbackProps) => {
  const [selectedStarIndex, setSelectedStarIndex] = useState<number>();

  const handleClose = () => {
    setSelectedStarIndex(undefined);
    onClose();
  };

  const { isPending, leaveReview } = useLeaveView(handleClose);

  const formRef = useRef<HTMLFormElement>(null);

  const isFormValid = selectedStarIndex !== undefined;

  const handleRatingChange = (index: number) => {
    setSelectedStarIndex(() => index);
  };

  const handleSubmit = () => {
    const form = formRef.current;

    if (!isFormValid || !form) {
      return;
    }

    const formData = new FormData(form);

    leaveReview({
      rating: (selectedStarIndex + 1) as Rating,
      feedback: (formData.get('feedback') || '') as string,
    });
  };

  return {
    isPending,
    isFormValid,
    formRef,
    ratingValue: selectedStarIndex,
    handleRatingChange,
    handleSubmit,
    handleClose,
  };
};
