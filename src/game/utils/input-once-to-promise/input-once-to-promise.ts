import { Scene } from 'phaser';

export const inputOnceToPromise = (scene: Scene, event: string | symbol) =>
  new Promise<undefined>((resolve) => {
    scene.input.once(event, () => resolve(undefined), this);
  });
