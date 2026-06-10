export interface HowToPlayGuideProps {
  isVisible?: boolean;
  onConfirm?(): void;
}

export interface Rule {
  key: string;
  icon: string;
  description: string;
}
