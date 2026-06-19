import { useClientProfile } from '@/hooks/use-client-profile';

export const useCoinsBalance = () => {
  const { data } = useClientProfile();

  const currencies = data?.currencies;

  return {
    amount: currencies?.goldCoins,
  };
};
