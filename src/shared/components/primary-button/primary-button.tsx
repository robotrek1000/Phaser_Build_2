import type { FC } from 'react';

import styles from './primary-button.module.css';

import type { PrimaryButtonProps } from './primary-button.types';

import { Loader } from '@/shared/components/loader';
import { cn } from '@/utils';

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  disabled,
  isPending,
  className,
  children,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(className, styles.button, isPending && styles.loading)}
      onClick={() => onClick?.()}
    >
      {!isPending && children}

      {isPending && <Loader variant="translucentBlack" size="s" />}
    </button>
  );
};
