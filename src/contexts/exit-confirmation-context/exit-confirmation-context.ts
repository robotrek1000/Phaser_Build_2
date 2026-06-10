import { createContext } from 'react';

import type { ExitConfirmationContextProps } from './exit-confirmation-context.types';

export const ExitConfirmationContext =
  createContext<ExitConfirmationContextProps>({
    isVisible: false,
    show: () => {},
    hide: () => {},
  });
