import { createContext } from 'react';

import { Game } from '@/game';

export const GameContext = createContext<Game | undefined>(undefined);
