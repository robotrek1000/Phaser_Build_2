import type { FC } from 'react';

import { useYachtSkinDisplay } from './use-yacht-skin-display';
import styles from './yacht-skin-display.module.css';

import type { YachtSkinDisplayProps } from './yacht-skin-display.types';

import { SKINS } from '@/components/main-screen/components/yacht-skin-display/yacht-skin-display.constants';
import { cn } from '@/utils';

export const YachtSkinDisplay: FC<YachtSkinDisplayProps> = ({ className }) => {
  const { selectedYacht } = useYachtSkinDisplay();

  return (
    <div className={cn(className, styles.container)}>
      <img className={styles.img} src={SKINS[selectedYacht.type]} alt="Yacht" />
    </div>
  );
};
