import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ClientProfile } from '@/shared/types';

import {
  CLIENT_PROFILE_QUERY_KEY,
  useClientProfile,
} from '@/hooks/use-client-profile';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
  updateClientSettings as updateClientSettingsApiFn,
  type UpdateClientSettingsRequest,
} from '@/shared/api';

const patchClientProfile = (
  currentClientProfile: ClientProfile,
  request: UpdateClientSettingsRequest
) => {
  const { currentYachtId, ...settings } = request;

  const newClientProfile: ClientProfile = {
    ...currentClientProfile,
    yachts: currentYachtId
      ? currentClientProfile.yachts.map((yacht) => {
          return { ...yacht, isSelected: yacht.id === currentYachtId };
        })
      : currentClientProfile.yachts,
    settings: { ...currentClientProfile.settings, ...settings },
  };

  return newClientProfile;
};

export const useUpdateClientSettings = (
  isOptimisticUpdate = true,
  onSuccess?: () => void,
  shouldInvalidateCache = true
) => {
  const queryClient = useQueryClient();

  const { isPending: isClientProfilePending } = useClientProfile();

  const { mutate, isPending: isUpdateClientSettingsPending } = useMutation({
    mutationFn: updateClientSettingsApiFn,
    onSuccess: async () => {
      if (shouldInvalidateCache) {
        await queryClient.invalidateQueries({
          queryKey: CLIENT_PROFILE_QUERY_KEY,
        });
      }

      onSuccess?.();
    },
  });

  const isPending = useDebouncedValue(
    isClientProfilePending || isUpdateClientSettingsPending,
    10
  );

  const updateClientSettings = (request: UpdateClientSettingsRequest) => {
    if (isOptimisticUpdate) {
      queryClient.setQueryData(
        CLIENT_PROFILE_QUERY_KEY,
        (currentClientProfile: ClientProfile) =>
          patchClientProfile(currentClientProfile, request)
      );
    }

    mutate(request);
  };

  return {
    isPending,
    updateClientSettings,
  };
};
