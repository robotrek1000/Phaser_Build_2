export type ClientYachtType = 'Normal' | 'Gold';

export type ClientYachtImprovementType =
  | 'Engine'
  | 'Frame'
  | 'Wheel'
  | 'Shield';

export type ClientLevelNumber = 1 | 2 | 3;

export interface ClientProfile {
  settings: ClientSettings;
  yachts: ClientYacht[];
  yachtImprovements: ClientYachtImprovement[];
  levels: ClientLevel[];
  attempts: ClientAttempts;
  currencies: ClientCurrencies;
}

export interface ClientSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  tutorialComplete: boolean;
}

export interface ClientYacht {
  id: string;
  type: ClientYachtType;
  title: string;
  description: string;
  isAvailable: boolean;
  unavailableDescription?: string;
  isSelected: boolean;
}

export interface ClientYachtImprovement {
  id: string;
  type: ClientYachtImprovementType;
  title: string;
  subTitle: string;
  description: string;
  taskDescription: string;
  isReceived: boolean;
}

export interface ClientLevel {
  id: string;
  number: ClientLevelNumber;
  title: string;
  isAvailable: boolean;
}

export interface ClientAttempts {
  freeAttempts: number;
  attemptRefresh: string;
  paidAttemptIsAvailable: boolean;
  paidAttemptPrice?: ClientPaidAttemptPrice;
}

export interface ClientPaidAttemptPrice {
  goldCoins?: number;
  diamonds?: number;
}

export interface ClientCurrencies {
  goldCoins: number;
  diamonds: number;
}
