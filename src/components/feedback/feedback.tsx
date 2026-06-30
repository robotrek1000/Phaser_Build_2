import type { FC } from 'react';

import styles from './feedback.module.css';
import { useFeedback } from './use-feedback';

import type { FeedbackProps } from './feedback.types';

import { PrimaryButton } from '@/shared/components/primary-button';
import { RatingField } from '@/shared/components/rating-field';
import { SailorModal } from '@/shared/components/sailor-modal';
import { TextareaField } from '@/shared/components/textarea-field';

export const Feedback: FC<FeedbackProps> = (props) => {
  const {
    isPending,
    isFormValid,
    formRef,
    ratingValue,
    handleRatingChange,
    handleSubmit,
    handleClose,
  } = useFeedback(props);

  return (
    <SailorModal
      isOpen={props.isVisible}
      variant="gray"
      topGradient="gray"
      sailorType="thumbsUp"
      footer={
        <PrimaryButton
          isPending={isPending}
          disabled={!isFormValid}
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          отправить
        </PrimaryButton>
      }
      onClose={handleClose}
    >
      <div className={styles.title}>Обратная связь</div>

      <div className={styles.subtitle}>
        Оцените игру и оставьте обратную связь
      </div>

      <form ref={formRef} className={styles.form}>
        <RatingField value={ratingValue} onChange={handleRatingChange} />

        <TextareaField
          className={styles.feedbackField}
          name="feedback"
          placeholder="Ваш отзыв"
        />
      </form>
    </SailorModal>
  );
};
