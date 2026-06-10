import type { FC } from 'react';

import styles from './slider-pagination.module.css';

import type { SliderPaginationProps } from './slider-pagination.types';

import { cn } from '@/utils';

export const SliderPagination: FC<SliderPaginationProps> = ({
  className,
  count,
  active,
}) => {
  return (
    <div className={cn(className, styles.container)}>
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={cn(styles.item, index === active && styles.activeItem)}
        />
      ))}
    </div>
  );
};
