import type { FC } from 'react';

import styles from './boosters.module.css';

import type { BoostersProps } from './boosters.types';

import { BOOSTERS_CONFIG } from '@/components/main-screen/components/boosters/boosters.constants';
import { useBoosters } from '@/components/main-screen/components/boosters/use-boosters';
import { Hr } from '@/shared/components/hr';
import { CheckmarkIcon, LockIcon } from '@/shared/components/icons';
import { ModalWindow } from '@/shared/components/modal-window';
import { PrimaryButton } from '@/shared/components/primary-button';
import { TextArt } from '@/shared/components/text-art';
import { cn } from '@/utils';

export const Boosters: FC<BoostersProps> = ({ className }) => {
  const {
    sortedBoosters,
    selectedBooster,
    handleBoosterClick,
    handleCloseBoosterModal,
  } = useBoosters();

  if (!sortedBoosters?.length) {
    return null;
  }

  return (
    <>
      <div className={cn(className, styles.boostersList)}>
        {sortedBoosters.map(({ type, title, isReceived }) => (
          <div
            key={type}
            className={styles.boostersListItem}
            onClick={() => handleBoosterClick(type)}
          >
            <div className={styles.boostersListItemImgContainer}>
              <img
                className={styles.boostersListItemImg}
                src={BOOSTERS_CONFIG[type].previewImg}
                alt=""
              />

              {isReceived && (
                <CheckmarkIcon
                  className={styles.boostersListItemIconCheckmark}
                />
              )}
            </div>

            <div className={styles.boostersListItemTitle}>{title}</div>
          </div>
        ))}
      </div>

      <ModalWindow
        {...(selectedBooster
          ? BOOSTERS_CONFIG[selectedBooster.type].modalProps
          : undefined)}
        isOpen={Boolean(selectedBooster)}
        footer={
          <PrimaryButton
            className={styles.boosterDetailsBtn}
            onClick={handleCloseBoosterModal}
          >
            Понятно
          </PrimaryButton>
        }
        onClose={handleCloseBoosterModal}
      >
        {selectedBooster && (
          <>
            <div className={styles.boosterDetailsImgContainer}>
              <img
                className={styles.boosterDetailsImg}
                src={BOOSTERS_CONFIG[selectedBooster.type].fullImg}
                alt=""
              />
            </div>

            <TextArt
              title={selectedBooster.title}
              subtitle={selectedBooster.subTitle}
            />

            <div className={styles.boosterDetailsDescription}>
              {selectedBooster.description}
            </div>

            <Hr className={styles.boosterDetailsSeparator} />

            <div className={styles.boosterDetailsExtraText}>
              {selectedBooster.isReceived && (
                <CheckmarkIcon className={styles.boosterDetailsExtraTextIcon} />
              )}

              {!selectedBooster.isReceived && (
                <LockIcon className={styles.boosterDetailsExtraTextIcon} />
              )}

              <div>
                {selectedBooster.isReceived && 'Бустер активен!'}

                {!selectedBooster.isReceived && selectedBooster.taskDescription}
              </div>
            </div>
          </>
        )}
      </ModalWindow>
    </>
  );
};
