import type { FC } from 'react';

import styles from './how-to-play-guide.module.css';

import type { HowToPlayGuideProps } from './how-to-play-guide.types';

import { RULES } from '@/components/how-to-play-guide/how-to-play-guide.constants';
import { Hr } from '@/shared/components/hr';
import { SailorModal } from '@/shared/components/sailor-modal';
import { SecondaryButton } from '@/shared/components/secondary-button';

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

      <Hr className={styles.separator} />

      <div className={styles.rules}>
        {RULES.map(({ key, icon, description }) => (
          <div key={key} className={styles.rule}>
            <div className={styles.ruleIconContainer}>
              <img src={icon} alt="Icon" className={styles.ruleIcon} />
            </div>

            <div className={styles.ruleDescription}>{description}</div>
          </div>
        ))}
      </div>
    </SailorModal>
  );
};
