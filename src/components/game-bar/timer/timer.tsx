import { memo } from 'react';

import styles from './timer.module.css';
import { useTimer } from './use-timer';

import type { TimerProps } from './timer.types';

import { cn } from '@/utils';

export const Timer = memo<TimerProps>(({ className }) => {
  const { timeDisplay } = useTimer();

  return <div className={cn(className, styles.container)}>{timeDisplay}</div>;
});
