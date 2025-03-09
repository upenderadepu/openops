import {
  QueryClient,
  usePrefetchQuery,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { authenticationSession } from '@/app/lib/authentication-session';
import { projectApi } from '@/app/lib/project-api';
import { Project } from '@openops/shared';

export const projectHooks = {
  prefetchProject: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePrefetchQuery<Project, Error>({
      queryKey: ['current-project'],
      queryFn: projectApi.current,
      staleTime: Infinity,
    });
  },
  useCurrentProject: () => {
    const query = useSuspenseQuery<Project, Error>({
      queryKey: ['current-project'],
      queryFn: projectApi.current,
      staleTime: Infinity,
    });
    return {
      ...query,
      project: query.data,
      updateProject,
      setCurrentProject,
    };
  },
  useProjects: () => {
    return useQuery<Project[], Error>({
      queryKey: ['projects'],
      queryFn: async () => {
        const results = await projectApi.list({
          cursor: undefined,
          limit: 100,
        });
        return results.data;
      },
    });
  },
};

const updateProject = async (queryClient: QueryClient, request: any) => {
  queryClient.setQueryData(['current-project'], {
    ...queryClient.getQueryData(['current-project'])!,
    ...request,
  });
};

const setCurrentProject = async (
  queryClient: QueryClient,
  project: Project,
  shouldReload = true,
) => {
  const projectChanged = authenticationSession.getProjectId() !== project.id;
  if (projectChanged) {
    await authenticationSession.switchToSession(project.id);
  }
  queryClient.setQueryData(['current-project'], project);
  if (projectChanged && shouldReload) {
    window.location.reload();
  }
};
