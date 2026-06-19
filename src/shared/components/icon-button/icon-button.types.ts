export type IconType = 'close' | 'settings' | 'exit';

export interface IconButtonProps {
  className?: string;
  icon: IconType;
  onClick?(): void;
}
