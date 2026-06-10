import { useContext } from 'react';

import { ExitConfirmationContext } from './exit-confirmation-context';

export const useExitConfirmation = () => useContext(ExitConfirmationContext);
