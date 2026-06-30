import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppError } from '@/contexts/app-error-context';
import { auth } from '@/shared/api';

const getSeamlessAuthParams = () => {
  const url = new URL(window.location.href);

  const seamlessToken =
    url.searchParams.get('seamless_token')?.trim() || undefined;

  const fingerPrint =
    url.searchParams.get('fingerprint')?.trim() ||
    url.searchParams.get('finger_print')?.trim() ||
    undefined;

  return { fingerPrint, seamlessToken };
};

const removeSeamlessAuthParams = (url: URL) => {
  url.searchParams.delete('seamless_token');
  url.searchParams.delete('fingerprint');
  url.searchParams.delete('finger_print');
};

export const AUTH_QUERY_KEY = ['auth'];

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery<boolean>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => auth(getSeamlessAuthParams()),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { show: showAppError } = useAppError();

  useEffect(() => {
    const url = new URL(window.location.href);

    removeSeamlessAuthParams(url);
    window.history.replaceState({}, '', url.toString());
  }, []);

  useEffect(() => {
    if (isError) {
      showAppError();
    }
  }, [isError, showAppError]);

  return {
    isLoading,
    isError,
    isAuthorized: Boolean(data),
  };
};
