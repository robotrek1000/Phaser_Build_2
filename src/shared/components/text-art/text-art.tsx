import type { FC } from 'react';

import styles from './text-art.module.css';

import type { TextArtProps } from './text-art.types';

import { cn } from '@/utils';

export const TextArt: FC<TextArtProps> = ({
  className,
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
}) => {
  return (
    <div className={cn(className, styles.container)}>
      <div className={cn(titleClassName, styles.title)}>{title}</div>

      <div className={cn(subtitleClassName, styles.subtitle)}>{subtitle}</div>
    </div>
  );
};
