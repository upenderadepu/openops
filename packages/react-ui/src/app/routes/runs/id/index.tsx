import { LoadingSpinner } from '@openops/components/ui';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { QueryKeys } from '@/app/constants/query-keys';
import { BuilderPage } from '@/app/features/builder';
import { BuilderStateProvider } from '@/app/features/builder/builder-state-provider';
import { flowRunsApi } from '@/app/features/flow-runs/lib/flow-runs-api';
import { flowsApi } from '@/app/features/flows/lib/flows-api';
import { FlowRun, PopulatedFlow } from '@openops/shared';

const FlowRunPage = () => {
  const { runId } = useParams();

  const { data, isLoading } = useQuery<
    {
      run: FlowRun;
      flow: PopulatedFlow;
    },
    Error
  >({
    queryKey: [QueryKeys.run, runId],
    queryFn: async () => {
      const flowRun = await flowRunsApi.getPopulated(runId!);
      const flow = await flowsApi.get(flowRun.flowId, {
        versionId: flowRun.flowVersionId,
      });
      return {
        run: flowRun,
        flow: flow,
      };
    },
    staleTime: 0,
    enabled: runId !== undefined,
  });

  if (isLoading) {
    return (
      <div className="bg-background flex h-screen w-screen items-center justify-center ">
        <LoadingSpinner size={50}></LoadingSpinner>
      </div>
    );
  }

  return (
    data && (
      <BuilderStateProvider
        flow={data.flow}
        flowVersion={data.flow.version}
        readonly={true}
        canExitRun={false}
        run={data.run}
      >
        <BuilderPage />
      </BuilderStateProvider>
    )
  );
};

export { FlowRunPage };
