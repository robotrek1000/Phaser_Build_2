import type { FC } from 'react';

import styles from './separator.module.css';

import type { SeparatorProps } from './separator.types';

import { cn } from '@/utils';

export const Separator: FC<SeparatorProps> = ({ className }) => {
  return <div className={cn(className, styles.separator)} />;
};
