import {
  CardList,
  CardListItemSkeleton,
  ScrollArea,
  SidebarHeader,
} from '@openops/components/ui';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';

import { QueryKeys } from '@/app/constants/query-keys';
import { useBuilderStateContext } from '@/app/features/builder/builder-hooks';
import { flowsApi } from '@/app/features/flows/lib/flows-api';
import { FlowVersionMetadata, SeekPage } from '@openops/shared';
import { LeftSideBarType } from '../builder-types';

import { FlowVersionDetailsCard } from './flow-versions-card';

const FlowVersionsList = () => {
  const [flow, setLeftSidebar, selectedFlowVersion] = useBuilderStateContext(
    (state) => [state.flow, state.setLeftSidebar, state.flowVersion],
  );

  const {
    data: flowVersionPage,
    isLoading,
    isError,
  } = useQuery<SeekPage<FlowVersionMetadata>, Error>({
    queryKey: [QueryKeys.flowVersions, flow.id],
    queryFn: () =>
      flowsApi.listVersions(flow.id, {
        limit: 100,
        cursor: undefined,
      }),
    staleTime: 0,
  });

  return (
    <>
      <SidebarHeader onClose={() => setLeftSidebar(LeftSideBarType.NONE)}>
        {t('Version History')}
      </SidebarHeader>
      <CardList>
        {isLoading && <CardListItemSkeleton numberOfCards={10} />}
        {isError && <div>{t('Error, please try again.')}</div>}
        {flowVersionPage && flowVersionPage.data && (
          <ScrollArea className="w-full h-full">
            {flowVersionPage.data.map((flowVersion, index) => (
              <FlowVersionDetailsCard
                selected={flowVersion.id === selectedFlowVersion?.id}
                published={flow.publishedVersionId === flowVersion.id}
                flowVersion={flowVersion}
                flowVersionNumber={flowVersionPage.data.length - index}
                key={flowVersion.id}
              />
            ))}
          </ScrollArea>
        )}
      </CardList>
    </>
  );
};

FlowVersionsList.displayName = 'FlowVersionsList';

export { FlowVersionsList };
