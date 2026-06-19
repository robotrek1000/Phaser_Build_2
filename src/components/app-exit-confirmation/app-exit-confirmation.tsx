import type { FC } from 'react';

import { useExitConfirmation } from '@/contexts/exit-confirmation-context';
import { ExitConfirmation } from '@/shared/components/exit-confirmation';

export const AppExitConfirmation: FC = () => {
  const { isVisible, hide } = useExitConfirmation();

  return (
    <ExitConfirmation
      isVisible={isVisible}
      onConfirm={() => {}}
      onDecline={hide}
      onClose={hide}
    />
  );
};
