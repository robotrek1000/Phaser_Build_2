import type { SailorPictureVariant } from './sailor-picture.types';

import sailorFarewell from '@/assets/sailor-farewell.png';
import happySailor from '@/assets/sailor-happy.png';
import sailorLookingFar from '@/assets/sailor-looking-far.png';
import normalSailor from '@/assets/sailor-normal.png';
import repairSailor from '@/assets/sailor-repair.png';
import sadSailor from '@/assets/sailor-sad.png';

export const SAILOR: Record<SailorPictureVariant, string> = {
  happy: happySailor,
  normal: normalSailor,
  sad: sadSailor,
  lookingFar: sailorLookingFar,
  farewell: sailorFarewell,
  repair: repairSailor,
};
