import type { FC } from 'react';

import styles from './switch-field.module.css';
import { useSwitchField } from './use-switch-field';

import type { SwitchFieldProps } from './switch-field.types';

import { cn } from '@/utils';

export const SwitchField: FC<SwitchFieldProps> = (props) => {
  const { value, onClick } = useSwitchField(props);

  return (
    <div
      className={cn(
        props.className,
        styles.container,
        value ? styles.checked : styles.unchecked
      )}
      onClick={onClick}
    />
  );
};
