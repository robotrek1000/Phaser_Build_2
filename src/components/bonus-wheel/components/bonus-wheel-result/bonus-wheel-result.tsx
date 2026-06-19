import type { FC } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { ANIMATION_CONFIG } from './bonus-wheel-result.constants';
import styles from './bonus-wheel-result.module.css';

import type { BonusWheelResultProps } from './bonus-wheel-result.types.ts';

import { useBonusWheelResult } from '@/components/bonus-wheel/components/bonus-wheel-result/use-bonus-wheel-result';
import { SecondaryButton } from '@/shared/components/secondary-button';

export const BonusWheelResult: FC<BonusWheelResultProps> = (props) => {
  const { bonusValues } = useBonusWheelResult(props);

  if (!bonusValues) {
    return null;
  }

  return (
    <AnimatePresence>
      {props.bonus && (
        <motion.div {...ANIMATION_CONFIG} className={styles.container}>
          <div className={styles.imgContainer}>
            {props.bonusMultiplier && (
              <div className={styles.bonusMultiplier}>
                {props.bonusMultiplier}x
              </div>
            )}

            <img className={styles.img} src={bonusValues.img} alt="" />

            {props.bonusValue && (
              <div className={styles.bonusValue}>{props.bonusValue}</div>
            )}
          </div>

          <div className={styles.description}>
            {bonusValues.descriptionLine1 && (
              <div>{bonusValues.descriptionLine1}</div>
            )}

            {bonusValues.descriptionLine2 && (
              <div>{bonusValues.descriptionLine2}</div>
            )}
          </div>

          <SecondaryButton
            className={styles.continueBtn}
            onClick={props.onContinueButtonClick}
          >
            Продолжить
          </SecondaryButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
