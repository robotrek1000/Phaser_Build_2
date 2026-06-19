import type { UpdateClientSettingsRequest } from './types';

import { delay } from '@/utils';

export const updateClientSettings = async (
  _request: UpdateClientSettingsRequest
) => {
  await delay(300);

  return;
};
