import { preload } from 'react-dom';

import boosterBody from '@/assets/booster-body.png';
import boosterEngine from '@/assets/booster-engine.png';
import boosterShield from '@/assets/booster-shield.png';
import boosterSteeringWheel from '@/assets/booster-steering-wheel.png';
import briefcaseWhiteShadow from '@/assets/briefcase-white-shadow.png';
import briefcase from '@/assets/briefcase.png';
import buoys from '@/assets/buoys.png';
import whiteCheckmark from '@/assets/checkmark-white.svg';
import clock from '@/assets/clock.png';
import coinXL from '@/assets/coin-xl.png';
import coin from '@/assets/coin.png';
import whiteCross from '@/assets/cross-white.svg';
import whiteCup from '@/assets/cup-white.svg';
import blueEllipse from '@/assets/ellipse-blue.svg';
import grayEllipse from '@/assets/ellipse-gray.svg';
import greenEllipse from '@/assets/ellipse-green.svg';
import orangeEllipse from '@/assets/ellipse-orange.svg';
import energyShield from '@/assets/energy-shield.png';
import energy from '@/assets/energy.png';
import whiteGear from '@/assets/exit-white.svg';
import blackFlag from '@/assets/flag-black.png';
import whiteFlag from '@/assets/flag-white.svg';
import whiteExit from '@/assets/gear-white.svg';
import hr from '@/assets/hr.svg';
import laurelLeft from '@/assets/laurel_left.png';
import laurelRight from '@/assets/laurel_right.png';
import closedLock from '@/assets/lock-closed.svg';
import lvl1Bg from '@/assets/lvl-1-bg.png';
import lvl2Bg from '@/assets/lvl-2-bg.png';
import lvl3Bg from '@/assets/lvl-3-bg.png';
import rightArrow from '@/assets/right-arrow.svg';
import sailorFarewell from '@/assets/sailor-farewell.png';
import happySailor from '@/assets/sailor-happy.png';
import sailorLookingFar from '@/assets/sailor-looking-far.png';
import normalSailor from '@/assets/sailor-normal.png';
import sadSailor from '@/assets/sailor-sad.png';
import xp from '@/assets/xp.png';
import blackYacht from '@/assets/yacht-black.png';
import yachtIconGold from '@/assets/yacht-icon-gold.png';
import yachtShadow from '@/assets/yacht-shadow.png';
import yachtSkinDefault from '@/assets/yacht-skin-default.png';
import yachtSkinGold from '@/assets/yacht-skin-gold.png';

const imagesToPreload = [
  boosterBody,
  boosterEngine,
  boosterShield,
  boosterSteeringWheel,
  briefcase,
  briefcaseWhiteShadow,
  buoys,
  whiteCheckmark,
  clock,
  coin,
  coinXL,
  whiteCross,
  whiteCup,
  blueEllipse,
  grayEllipse,
  greenEllipse,
  orangeEllipse,
  energy,
  energyShield,
  whiteExit,
  blackFlag,
  whiteFlag,
  whiteGear,
  hr,
  laurelLeft,
  laurelRight,
  closedLock,
  lvl1Bg,
  lvl2Bg,
  lvl3Bg,
  rightArrow,
  sailorFarewell,
  happySailor,
  sailorLookingFar,
  normalSailor,
  sadSailor,
  xp,
  blackYacht,
  yachtIconGold,
  yachtShadow,
  yachtSkinDefault,
  yachtSkinGold,
];

export const preloadImages = () => {
  imagesToPreload.forEach((src) => {
    preload(src, { as: 'image' });
  });
};
