import styles from './boosters.module.css';

import type { BoosterConfig, BoosterType } from './boosters.types';

import boosterBody from '@/assets/booster-body.png';
import boosterEngine from '@/assets/booster-engine.png';
import boosterShield from '@/assets/booster-shield.png';
import boosterSteeringWheel from '@/assets/booster-steering-wheel.png';

const config: Record<BoosterType, BoosterConfig> = {
  body: {
    title: 'Корпус',
    img: boosterBody,
    className: styles.boosterImgBody,
  },
  engine: {
    title: 'Мотор',
    img: boosterEngine,
    className: styles.boosterImgEngine,
  },
  shield: {
    title: 'Щит',
    img: boosterShield,
    className: styles.boosterImgShield,
  },
  steeringWheel: {
    title: 'Штурвал',
    img: boosterSteeringWheel,
    className: styles.boosterImgSteeringWheel,
  },
};

const order: BoosterType[] = ['engine', 'body', 'steeringWheel', 'shield'];

export const BOOSTERS = order.map((type) => ({
  type,
  ...config[type],
}));
