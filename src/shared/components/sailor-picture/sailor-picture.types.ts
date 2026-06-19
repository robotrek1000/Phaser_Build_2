export type SailorPictureVariant =
  | 'normal'
  | 'happy'
  | 'sad'
  | 'lookingFar'
  | 'farewell'
  | 'repair';

export interface SailorPictureProps {
  variant: SailorPictureVariant;
  className?: string;
}
