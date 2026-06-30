export interface AppErrorContextProps {
  isVisible: boolean;
  refresh(): void;
  show(onRefresh?: () => void): void;
  hide(): void;
}
