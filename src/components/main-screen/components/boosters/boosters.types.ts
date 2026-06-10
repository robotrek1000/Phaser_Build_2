export type BoosterType = 'engine' | 'body' | 'steeringWheel' | 'shield';

export interface BoosterConfig {
  title: string;
  img: string;
  className: string;
}

export interface BoostersProps {
  className?: string;
  boostersState: Record<BoosterType, boolean>;
  onBoosterClick(booster: BoosterType): void;
}
