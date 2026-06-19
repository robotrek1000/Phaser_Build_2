import { useExitConfirmation } from '@/contexts/exit-confirmation-context';

export const useAppError = () => {
  const { show: showExitConfirmation } = useExitConfirmation();

  const handleExitButtonClick = () => {
    showExitConfirmation();
  };

  const handleRefreshButtonClick = () => {
    window.location.reload();
  };

  return {
    handleExitButtonClick,
    handleRefreshButtonClick,
  };
};
