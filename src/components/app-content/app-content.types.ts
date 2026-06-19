export type State = 'loading' | 'main' | 'playing' | 'bonusWheel' | 'result';

export interface AppContentProps {
  onContentReady(): void;
}
