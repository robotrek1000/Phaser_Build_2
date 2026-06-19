import type { FC } from 'react';

import styles from './how-to-play-guide.module.css';

import type { HowToPlayGuideProps } from './how-to-play-guide.types';

import { RULES } from '@/components/how-to-play-guide/how-to-play-guide.constants';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SecondaryButton } from '@/shared/components/secondary-button';
import { Separator } from '@/shared/components/separator';

export const HowToPlayGuide: FC<HowToPlayGuideProps> = ({
  isVisible,
  onConfirm,
}) => {
  return (
    <SailorModal
      isOpen={isVisible}
      variant="blue"
      sailorType="lookingFar"
      className={styles.modalWindow}
      footer={
        <SecondaryButton className={styles.gotItBtn} onClick={onConfirm}>
          Понятно
        </SecondaryButton>
      }
      onClose={onConfirm}
    >
      <div className={styles.title}>Как играть</div>

      <Separator className={styles.separator} />

      <div className={styles.onboarding}>
        {RULES.map(({ key, icon, description }) => (
          <div key={key} className={styles.onboardingItem}>
            <div className={styles.onboardingItemIconContainer}>
              <img
                src={icon}
                alt="Icon"
                className={styles.onboardingItemIcon}
              />
            </div>

            <div className={styles.onboardingItemDescription}>
              {description}
            </div>
          </div>
        ))}
      </div>
    </SailorModal>
  );
};
