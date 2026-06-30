import type { UpdateClientSettingsRequest } from './update-client-settings.types';

import { delay } from '@/utils';

export const updateClientSettings = async (
  request: UpdateClientSettingsRequest
) => {
  console.log(request);

  await delay(300);

  return;
};
