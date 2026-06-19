export type LoaderVariant = 'white' | 'translucentBlack';

export type LoaderSize = 's' | 'm';

export interface LoaderProps {
  className?: string;
  variant?: LoaderVariant;
  size?: LoaderSize;
}
