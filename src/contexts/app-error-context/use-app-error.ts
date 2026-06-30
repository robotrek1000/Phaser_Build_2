import { useContext } from 'react';

import { AppErrorContext } from './app-error-context';

export const useAppError = () => useContext(AppErrorContext);
