import type { SailorPictureVariant } from './sailor-picture.types';

import sailorFarewell from '@/assets/sailor-farewell.webp';
import happySailor from '@/assets/sailor-happy.webp';
import sailorLookingFar from '@/assets/sailor-looking-far.webp';
import normalSailor from '@/assets/sailor-normal.webp';
import sailorLookingFarOrange from '@/assets/sailor-orange.webp';
import repairSailor from '@/assets/sailor-repair.webp';
import sadSailor from '@/assets/sailor-sad.webp';
import sailorThumbsUp from '@/assets/sailor-thumbs-up.webp';

export const SAILOR: Record<SailorPictureVariant, string> = {
  happy: happySailor,
  normal: normalSailor,
  sad: sadSailor,
  lookingFar: sailorLookingFar,
  lookingFarOrange: sailorLookingFarOrange,
  farewell: sailorFarewell,
  repair: repairSailor,
  thumbsUp: sailorThumbsUp,
};
