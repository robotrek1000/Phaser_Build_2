import type { FC } from 'react';

import styles from './icon-button.module.css';

import type { IconButtonProps } from './icon-button.types';

import { useIconButton } from '@/shared/components/icon-button/use-icon-button';
import { cn } from '@/utils';

export const IconButton: FC<IconButtonProps> = (props) => {
  const { Icon, handleClick } = useIconButton(props);

  return (
    <button
      className={cn(props.className, styles.button)}
      onClick={handleClick}
    >
      <Icon className={styles.icon} />
    </button>
  );
};
