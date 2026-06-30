import { useQuery } from '@tanstack/react-query';

import type { ClientProfile } from '@/shared/types';

import { useAuth } from '@/hooks/use-auth';
import { getClientProfile } from '@/shared/api';

export const CLIENT_PROFILE_QUERY_KEY = ['client-profile'];

export const useClientProfile = () => {
  const { isAuthorized } = useAuth();

  return useQuery<ClientProfile>({
    queryKey: CLIENT_PROFILE_QUERY_KEY,
    queryFn: getClientProfile,
    enabled: isAuthorized,
  });
};
