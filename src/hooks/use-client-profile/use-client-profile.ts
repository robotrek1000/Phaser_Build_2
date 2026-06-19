import { useQuery } from '@tanstack/react-query';

import type { ClientProfile } from '@/shared/types';

import { getClientProfile } from '@/shared/api';

export const CLIENT_PROFILE_QUERY_KEY = ['client-profile'];

export const useClientProfile = () => {
  return useQuery<ClientProfile>({
    queryKey: CLIENT_PROFILE_QUERY_KEY,
    queryFn: getClientProfile,
  });
};
