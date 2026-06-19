import { useState } from 'react';

import type { YachtSkinSelectProps } from './yacht-skin-select.types';
import type { PanInfo } from 'motion';

import { useClientProfile } from '@/hooks/use-client-profile';
import { useUpdateClientSettings } from '@/hooks/use-update-client-settings';

const swipeThreshold = 80;
const velocityThreshold = 500;

export const useYachtSkinSelect = ({ onClose }: YachtSkinSelectProps) => {
  const { data } = useClientProfile();

  if (!data) {
    throw new Error('Client profile is not defined');
  }

  const yachtList = data.yachts;

  const [displayedYachtId, setDisplayedYachtId] = useState(
    (yachtList.find(({ isSelected }) => isSelected) ?? yachtList[1]).id
  );

  const displayedYachtIndex = yachtList.findIndex(
    ({ id }) => id === displayedYachtId
  );

  const displayedYacht = yachtList[displayedYachtIndex];

  const { isPending: isUpdateClientSettingsPending, updateClientSettings } =
    useUpdateClientSettings(false, onClose);

  const handleApplyYachtSkin = () => {
    updateClientSettings({ currentYachtId: displayedYachtId });
  };

  const handleSlideDragEnd = (_event: MouseEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newDisplayedYachtIndex = displayedYachtIndex;

    if (offset < -swipeThreshold || velocity < -velocityThreshold) {
      newDisplayedYachtIndex = Math.min(
        newDisplayedYachtIndex + 1,
        yachtList.length - 1
      );
    } else if (offset > swipeThreshold || velocity > velocityThreshold) {
      newDisplayedYachtIndex = Math.max(newDisplayedYachtIndex - 1, 0);
    }

    if (newDisplayedYachtIndex !== displayedYachtIndex) {
      setDisplayedYachtId(yachtList[newDisplayedYachtIndex].id);
    }
  };

  if (!displayedYacht) {
    throw new Error('Yacht is not found');
  }

  return {
    yachtList,
    displayedYacht,
    displayedYachtIndex,
    isUpdateClientSettingsPending,
    setDisplayedYachtId,
    handleSlideDragEnd,
    handleApplyYachtSkin,
  };
};
