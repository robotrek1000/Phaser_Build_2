import { createContext } from 'react';

import type { AppErrorContextProps } from './app-error-context.types';

export const AppErrorContext = createContext<AppErrorContextProps>({
  isVisible: false,
  refresh: () => {},
  show: () => {},
  hide: () => {},
});
