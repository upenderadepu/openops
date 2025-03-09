import { platformApi } from '@/app/lib/platforms-api';
import { usePrefetchQuery, useSuspenseQuery } from '@tanstack/react-query';

export const platformHooks = {
  prefetchPlatform: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePrefetchQuery({
      queryKey: ['organization'],
      queryFn: platformApi.getCurrentOrganization,
      staleTime: Infinity,
    });
  },
  useCurrentPlatform: () => {
    const query = useSuspenseQuery({
      queryKey: ['organization'],
      queryFn: platformApi.getCurrentOrganization,
      staleTime: Infinity,
    });
    return {
      platform: query.data,
      refetch: async () => {
        await query.refetch();
      },
    };
  },
};
