export type IconType = 'close' | 'settings' | 'exit';

export interface IconButtonProps {
  className?: string;
  isSoundDisabled?: boolean;
  icon: IconType;
  onClick?(): void;
}
