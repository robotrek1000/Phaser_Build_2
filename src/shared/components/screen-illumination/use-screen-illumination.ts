import type { ScreenIlluminationProps } from '@/shared/components/screen-illumination/screen-illumination.types';

export const useScreenIllumination = ({
  onAnimationEnd,
}: ScreenIlluminationProps) => {
  const handleAnimationEnd = () => {
    onAnimationEnd();
  };

  return { handleAnimationEnd };
};
