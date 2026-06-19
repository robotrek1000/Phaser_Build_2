export interface MainScreenProps {
  isGamePending?: boolean;
  onContentReady(): void;
  onStartGame(): void;
}
