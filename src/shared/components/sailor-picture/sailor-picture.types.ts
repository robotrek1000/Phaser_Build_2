export type SailorPictureVariant =
  | 'normal'
  | 'happy'
  | 'sad'
  | 'lookingFar'
  | 'lookingFarOrange'
  | 'farewell'
  | 'repair'
  | 'thumbsUp';

export interface SailorPictureProps {
  variant: SailorPictureVariant;
  className?: string;
}
