import type { FC } from 'react';

import { ExitConfirmation } from '@/components/shared/components/exit-confirmation';
import { useExitConfirmation } from '@/contexts/exit-confirmation-context';

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
