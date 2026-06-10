import Phaser from 'phaser';

export const getHeightRatio = (
  object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
  targetHeight: number
) => {
  const height =
    object.frame.realHeight > 0 ? object.frame.realHeight : object.height;

  return targetHeight / height;
};
