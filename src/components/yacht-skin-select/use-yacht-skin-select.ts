import { useState } from 'react';

import type { YachtSkinSelectProps } from './yacht-skin-select.types';

import { useClientProfile } from '@/hooks/use-client-profile';
import { useUiInteractionSound } from '@/hooks/use-ui-interaction-sound';
import { useUpdateClientSettings } from '@/hooks/use-update-client-settings';

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

  const { playSwipeSound } = useUiInteractionSound();

  const handleApplyYachtSkin = () => {
    updateClientSettings({ currentYachtId: displayedYachtId });
  };

  const handleSlideChange = (index: number) => {
    playSwipeSound();
    setDisplayedYachtId(yachtList[index].id);
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
    handleSlideChange,
    handleApplyYachtSkin,
  };
};
