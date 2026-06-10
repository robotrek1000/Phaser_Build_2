import type { FC } from 'react';

import styles from './primary-button.module.css';

import type { PrimaryButtonProps } from './primary-button.types';

import { cn } from '@/utils';

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  disabled,
  className,
  children,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(className, styles.button)}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
};
