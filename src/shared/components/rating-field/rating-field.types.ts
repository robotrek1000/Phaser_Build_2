export interface RatingFieldProps {
  className?: string;
  total?: number;
  value?: number;
  onChange(value?: number): void;
}
