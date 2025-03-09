import { flagsHooks } from '@/app/common/hooks/flags-hooks';
import { useAppStore } from '@/app/store/app-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { cloudUserApi } from './cloud-user-api';

export const useCloudProfile = () => {
  const { setCloudUser } = useAppStore((s) => ({
    cloudUser: s.cloudUser,
    setCloudUser: s.setCloudUser,
  }));

  const useCloudTemplates = flagsHooks.useShouldFetchCloudTemplates();
  const { data, refetch, isSuccess } = useQuery({
    queryKey: ['cloud-user-info'],
    queryFn: () => {
      return cloudUserApi.getUserInfo();
    },
    enabled: useCloudTemplates,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    networkMode: 'always',
  });

  useEffect(() => {
    if (isSuccess) {
      setCloudUser(data);
    }
  }, [isSuccess, data, setCloudUser]);

  return {
    cloudTemplatesProfile: data,
    isConnectedToCloudTemplates: data !== null,
    refetchIsConnectedToCloudTemplates: refetch,
  };
};
