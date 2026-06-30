import type { FC } from 'react';

import { SIZE } from './secondary-button.constants';
import styles from './secondary-button.module.css';
import { useSecondaryButton } from './use-secondary-button';

import type { SecondaryButtonProps } from './secondary-button.types';

import { cn } from '@/utils';

export const SecondaryButton: FC<SecondaryButtonProps> = (props) => {
  const { size, handleClick } = useSecondaryButton(props);

  return (
    <button
      className={cn(props.className, styles.button, SIZE[size])}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};
