import type { FC } from 'react';

import styles from './rating-field.module.css';

import type { RatingFieldProps } from './rating-field.types';

import { StarIcon } from '@/shared/components/icons';
import { cn } from '@/utils';

export const RatingField: FC<RatingFieldProps> = ({
  className,
  total = 5,
  value = -1,
  onChange,
}) => {
  return (
    <div className={cn(className, styles.container)}>
      {Array.from({ length: total }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            styles.star,
            index <= value ? styles.selectedStar : styles.unselectedStar
          )}
          onClick={() => onChange(index)}
        />
      ))}
    </div>
  );
};
