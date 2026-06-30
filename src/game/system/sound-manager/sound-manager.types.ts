import { Sound as PhaserSound } from 'phaser';

import { ASSET_KEYS } from '@/game/asset-keys.config';

export type AllSounds = keyof typeof ASSET_KEYS.sounds;

export type BackgroundMusic = 'interfaceMusic' | 'gameplayMusic';

export type OnlySounds = Exclude<AllSounds, 'interfaceMusic' | 'gameplayMusic'>;

export type Sound =
  | PhaserSound.HTML5AudioSound
  | PhaserSound.NoAudioSound
  | PhaserSound.WebAudioSound;

export type SoundManagerState = 'interface' | 'game';

export interface SoundManagerInitArgs {
  isSoundEnabled?: boolean;
  isMusicEnabled?: boolean;
}
