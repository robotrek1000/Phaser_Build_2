import type { FC } from 'react';

import { useYachtSkinSelect } from './use-yacht-skin-select';
import styles from './yacht-skin-select.module.css';

import type { YachtSkinSelectProps } from './yacht-skin-select.types';

import {
  MODAL_PROPS_CONFIG,
  SKINS_CONFIG,
} from '@/components/yacht-skin-select/yacht-skin-select.constants';
import { Hr } from '@/shared/components/hr';
import { CheckmarkIcon, LockIcon } from '@/shared/components/icons';
import { ModalWindow } from '@/shared/components/modal-window';
import { PrimaryButton } from '@/shared/components/primary-button';
import { Slider } from '@/shared/components/slider';
import { SliderPagination } from '@/shared/components/slider-pagination';
import { TextArt } from '@/shared/components/text-art';

export const YachtSkinSelect: FC<YachtSkinSelectProps> = (props) => {
  const {
    yachtList,
    displayedYacht,
    displayedYachtIndex,
    isUpdateClientSettingsPending,
    handleSlideChange,
    handleApplyYachtSkin,
  } = useYachtSkinSelect(props);

  return (
    <ModalWindow
      {...MODAL_PROPS_CONFIG[displayedYacht.type]}
      className={styles.modalWindow}
      isOpen={props.isVisible}
      onClose={props.onClose}
      footer={
        <div className={styles.footer}>
          {!displayedYacht.isSelected && !displayedYacht.isAvailable && (
            <div className={styles.footerHint}>
              откройте все улучшения, чтобы разблокировать
            </div>
          )}

          <PrimaryButton
            className={styles.applyBtn}
            disabled={displayedYacht.isSelected || !displayedYacht.isAvailable}
            isPending={isUpdateClientSettingsPending}
            onClick={handleApplyYachtSkin}
          >
            {displayedYacht.isSelected && (
              <span className={styles.applyBtnContent}>
                <CheckmarkIcon className={styles.applyBtnIcon} />

                <span>Выбранно</span>
              </span>
            )}

            {!displayedYacht.isSelected && !displayedYacht.isAvailable && (
              <span className={styles.applyBtnContent}>
                <LockIcon className={styles.applyBtnIcon} />

                <span>заблокировано</span>
              </span>
            )}

            {!displayedYacht.isSelected &&
              displayedYacht.isAvailable &&
              'выбрать'}
          </PrimaryButton>
        </div>
      }
    >
      <TextArt
        className={styles.textArt}
        title={displayedYacht.title}
        subtitle="яхта"
      />

      <Slider
        className={styles.slider}
        slideClassName={styles.slide}
        slides={yachtList.map((yacht) => (
          <img
            className={styles.slideImg}
            src={SKINS_CONFIG[yacht.type]}
            alt=""
          />
        ))}
        activeSlideIndex={displayedYachtIndex}
        onSlideChange={handleSlideChange}
      />

      <SliderPagination
        className={styles.pagination}
        count={yachtList.length}
        active={displayedYachtIndex}
      />

      <div className={styles.yachtDescription}>
        {displayedYacht.description}
      </div>

      <Hr className={styles.separator} />
    </ModalWindow>
  );
};
