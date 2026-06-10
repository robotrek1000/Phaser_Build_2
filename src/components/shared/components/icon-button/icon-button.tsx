import type { FC } from 'react';

import { ICON } from './icon-button.constants';
import styles from './icon-button.module.css';

import type { IconButtonProps } from './icon-button.types';

import { cn } from '@/utils';

export const IconButton: FC<IconButtonProps> = ({
  className,
  icon,
  onClick,
}) => {
  return (
    <button
      className={cn(className, styles.button, ICON[icon])}
      onClick={() => onClick?.()}
    />
  );
};
