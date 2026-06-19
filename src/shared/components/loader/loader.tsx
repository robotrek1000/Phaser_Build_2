import type { FC } from 'react';

import { LOADER_SIZES, LOADER_VARIANTS } from './loader.constants';
import styles from './loader.module.css';

import type { LoaderProps } from './loader.types';

import { LoaderIcon } from '@/shared/components/icons';
import { cn } from '@/utils';

export const Loader: FC<LoaderProps> = ({
  className,
  variant = 'white',
  size = 'm',
}) => {
  return (
    <span
      className={cn(
        className,
        styles.container,
        LOADER_VARIANTS[variant],
        LOADER_SIZES[size]
      )}
    >
      <LoaderIcon className={styles.icon} />
    </span>
  );
};
