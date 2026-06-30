import type { FC } from 'react';

import styles from './textarea-field.module.css';

import type { TextareaFieldProps } from './textarea-field.types';

import { cn } from '@/utils';

export const TextareaField: FC<TextareaFieldProps> = ({
  className,
  ...restProps
}) => {
  return <textarea {...restProps} className={cn(className, styles.textarea)} />;
};
