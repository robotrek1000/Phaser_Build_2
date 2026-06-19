import { useClientProfile } from '@/hooks/use-client-profile';

export const useYachtSkinDisplay = () => {
  const { data } = useClientProfile();

  if (!data) {
    throw new Error('Client profile is not defined');
  }

  const selectedYacht = data.yachts.find(({ isSelected }) => isSelected);

  if (!selectedYacht) {
    throw new Error('Yacht skin is not selected');
  }

  return { selectedYacht };
};
