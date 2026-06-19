import type { ClientYachtType } from '@/shared/types';

import yachtSkinDefault from '@/assets/yacht-skin-default.png';
import yachtSkinGold from '@/assets/yacht-skin-gold.png';

export const SKINS: Record<ClientYachtType, string> = {
  Gold: yachtSkinGold,
  Normal: yachtSkinDefault,
};
