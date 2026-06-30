import type { GameplayEvent } from '@/game/game.types';
import type {
  AllSounds,
  BackgroundMusic,
  OnlySounds,
} from '@/game/system/sound-manager/sound-manager.types';
import type { Types } from 'phaser';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export const BACKGROUND_MUSIC: BackgroundMusic[] = [
  'interfaceMusic',
  'gameplayMusic',
];

export const ONLY_SOUNDS = Object.keys(ASSET_KEYS.sounds).filter(
  (key) => !BACKGROUND_MUSIC.includes(key as BackgroundMusic)
) as OnlySounds[];

export const GAMEPLAY_EVENTS_SOUND_CONFIG: Record<
  GameplayEvent,
  AllSounds | AllSounds[]
> = {
  activateEnergyShield: 'maximize5',
  deactivateEnergyShield: 'minimize5',
  energy: 'glass5',
  moneyDown: 'bong1',
  moneyUp: ['drop2', 'drop3'],
  reef: 'noise1',
  timeBonus: 'glass1',
  whirlpool: 'minimize6',
};

export const BACKGROUND_MUSIC_CONFIG: Types.Sound.SoundConfig = {
  volume: 1,
  loop: true,
};

export const ONLY_SOUNDS_CONFIG: Types.Sound.SoundConfig = {
  volume: 0.75,
};
