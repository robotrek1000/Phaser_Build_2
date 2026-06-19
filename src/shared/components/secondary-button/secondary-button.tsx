import type { FC } from 'react';

import { SIZE } from './secondary-button.constants';
import styles from './secondary-button.module.css';

import type { SecondaryButtonProps } from './secondary-button.types';

import { cn } from '@/utils';

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  className,
  size = 'm',
  children,
  onClick,
}) => {
  return (
    <button
      className={cn(className, styles.button, SIZE[size])}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
};
