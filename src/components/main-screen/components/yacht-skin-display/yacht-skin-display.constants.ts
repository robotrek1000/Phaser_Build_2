import type { ClientYachtType } from '@/shared/types';

import yachtSkinDefault from '@/assets/yacht_skin_1.webp';
import yachtSkinGold from '@/assets/yacht_skin_2.webp';

export const SKINS: Record<ClientYachtType, string> = {
  Gold: yachtSkinGold,
  Normal: yachtSkinDefault,
};
