import { CLIENT_PROFILE_RESPONSE } from './mock';

import type { ClientProfile } from '@/shared/types';

import { delay } from '@/utils';

export const getClientProfile = async (): Promise<ClientProfile> => {
  await delay(300);

  return CLIENT_PROFILE_RESPONSE;
};
