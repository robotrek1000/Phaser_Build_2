import type { FC } from 'react';

import styles from './sailor-picture.module.css';

import type { SailorPictureProps } from './sailor-picture.types';

import { SAILOR } from '@/shared/components/sailor-picture/sailor-picture.constants';
import { cn } from '@/utils';

export const SailorPicture: FC<SailorPictureProps> = ({
  variant,
  className,
}) => {
  return (
    <img className={cn(className, styles.img)} src={SAILOR[variant]} alt="" />
  );
};
