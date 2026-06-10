import * as Phaser from 'phaser';

export const setResultIconSize = (
  icon: Phaser.GameObjects.Image,
  maxWidth: number,
  maxHeight: number
) => {
  const textureFrame = icon.frame;
  const sourceWidth = textureFrame?.realWidth ?? textureFrame?.width ?? 1;
  const sourceHeight = textureFrame?.realHeight ?? textureFrame?.height ?? 1;
  const widthScale = maxWidth / Math.max(1, sourceWidth);
  const heightScale = maxHeight / Math.max(1, sourceHeight);
  const uniformScale = Math.min(widthScale, heightScale);

  icon.setScale(uniformScale);
};
