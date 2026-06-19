import type { FC, SVGProps } from 'react';

import type { IconType } from './icon-button.types';

import { CrossIcon, ExitIcon, GearIcon } from '@/shared/components/icons';

export const ICON: Record<IconType, FC<SVGProps<SVGSVGElement>>> = {
  close: CrossIcon,
  exit: ExitIcon,
  settings: GearIcon,
};
