import { Game, Utils } from 'phaser';

import type {
  AllSounds,
  Sound,
  SoundManagerInitArgs,
  SoundManagerState,
} from './sound-manager.types';
import type { GameEventMap, GameplayEvent } from '@/game/game.types';

import { GAME_EVENT_GAMEPLAY_EVENT } from '@/game';
import { ASSET_KEYS } from '@/game/asset-keys.config';
import {
  BACKGROUND_MUSIC,
  BACKGROUND_MUSIC_CONFIG,
  GAMEPLAY_EVENTS_SOUND_CONFIG,
  ONLY_SOUNDS,
  ONLY_SOUNDS_CONFIG,
} from '@/game/system/sound-manager/sound-manager.config';

export class SoundManager {
  private game: Game;

  private state: SoundManagerState = 'interface';

  private allSounds = new Map<AllSounds, Sound>();

  private backgroundMusic?: Sound;

  private isMusicEnabled = true;

  private isSoundEnabled = true;

  constructor(game: Game) {
    this.game = game;

    this.game.events.on(
      GAME_EVENT_GAMEPLAY_EVENT,
      (gameplayEvent: GameEventMap[typeof GAME_EVENT_GAMEPLAY_EVENT]) => {
        this.playGameplayEventSound(gameplayEvent as GameplayEvent);
      }
    );
  }

  create() {
    BACKGROUND_MUSIC.forEach((key) => {
      this.allSounds.set(
        key,
        this.game.sound.add(ASSET_KEYS.sounds[key], BACKGROUND_MUSIC_CONFIG)
      );
    });

    ONLY_SOUNDS.forEach((key) => {
      this.allSounds.set(
        key,
        this.game.sound.add(ASSET_KEYS.sounds[key], ONLY_SOUNDS_CONFIG)
      );
    });
  }

  applySettings({ isMusicEnabled, isSoundEnabled }: SoundManagerInitArgs) {
    if (isMusicEnabled !== undefined) {
      this.isMusicEnabled = isMusicEnabled;
    }

    if (isSoundEnabled !== undefined) {
      this.isSoundEnabled = isSoundEnabled;
    }

    this.triggerBackgroundMusic();
  }

  setState(state: SoundManagerState) {
    this.state = state;

    this.triggerBackgroundMusic();
  }

  playSound(key: AllSounds) {
    if (!this.isSoundEnabled) {
      return;
    }

    this.allSounds.get(key)?.play();
  }

  playRandomSound(keys: AllSounds[]) {
    const key = Utils.Array.GetRandom(keys);

    this.playSound(key);
  }

  private triggerBackgroundMusic() {
    const interfaceMusic = this.allSounds.get('interfaceMusic');
    const gameplayMusic = this.allSounds.get('gameplayMusic');
    const currentBackgroundMusic =
      this.state === 'interface' ? interfaceMusic : gameplayMusic;

    if (!interfaceMusic || !gameplayMusic) {
      return;
    }

    if (!this.backgroundMusic) {
      this.backgroundMusic = currentBackgroundMusic;
    }

    if (!this.isMusicEnabled) {
      this.backgroundMusic?.stop();

      return;
    }

    if (this.backgroundMusic !== currentBackgroundMusic) {
      this.backgroundMusic?.stop();
      currentBackgroundMusic?.play();

      this.backgroundMusic = currentBackgroundMusic;

      return;
    }

    if (!this.backgroundMusic?.isPlaying) {
      this.backgroundMusic?.play();
    }
  }

  private playGameplayEventSound(event: GameplayEvent) {
    const soundConfig = GAMEPLAY_EVENTS_SOUND_CONFIG[event];

    if (!soundConfig) {
      return;
    }

    if (typeof soundConfig === 'string') {
      this.playSound(soundConfig);
    } else {
      this.playRandomSound(soundConfig);
    }
  }
}
