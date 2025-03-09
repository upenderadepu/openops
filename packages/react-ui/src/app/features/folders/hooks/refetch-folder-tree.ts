import { authenticationSession } from '@/app/lib/authentication-session';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useRefetchFolderTree = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['folders/flows', authenticationSession.getProjectId()],
      }),
      queryClient.invalidateQueries({
        queryKey: ['folders/flows/search'],
      }),
    ]);
  }, [queryClient]);
};
