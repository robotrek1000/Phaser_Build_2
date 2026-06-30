import type { FC } from 'react';

import styles from './primary-button.module.css';
import { usePrimaryButton } from './use-primary-button';

import type { PrimaryButtonProps } from './primary-button.types';

import { Loader } from '@/shared/components/loader';
import { cn } from '@/utils';

export const PrimaryButton: FC<PrimaryButtonProps> = (props) => {
  const { handleClick } = usePrimaryButton(props);

  return (
    <button
      disabled={props.disabled}
      className={cn(
        props.className,
        styles.button,
        props.isPending && styles.loading
      )}
      onClick={handleClick}
    >
      {!props.isPending && props.children}

      {props.isPending && <Loader variant="translucentBlack" size="s" />}
    </button>
  );
};
