import { embedDashboard } from '@superset-ui/embedded-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { flagsHooks } from '@/app/common/hooks/flags-hooks';
import { useDefaultSidebarState } from '@/app/common/hooks/use-default-sidebar-state';
import { authenticationApi } from '@/app/lib/authentication-api';
import { FlagId } from '@openops/shared';
import './openops-analytics.css';

const dashboardUiConfig = {
  hideTitle: true,
  hideChartControls: false,
  hideTab: false,
  filters: {
    expanded: false,
    visible: false,
  },
};

const OpenOpsAnalyticsPage = () => {
  useDefaultSidebarState('minimized');

  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const { data: analyticsPublicUrl } = flagsHooks.useFlag<string | undefined>(
    FlagId.ANALYTICS_PUBLIC_URL,
  );

  const { data: dashboardEmbedId, isSuccess } = useQuery({
    queryKey: ['analytics-embed-id'],
    queryFn: authenticationApi.fetchAnalyticsEmbedId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && analyticsPublicUrl) {
      const mountPoint = iframeContainerRef.current;
      if (mountPoint) {
        if (!dashboardEmbedId) {
          console.error('OpenOps Analytics Dashboard id is not defined');
          return;
        }

        embedDashboard({
          id: dashboardEmbedId,
          supersetDomain: analyticsPublicUrl + '/openops-analytics',
          mountPoint: mountPoint,
          fetchGuestToken: () =>
            authenticationApi.fetchAnalyticsGuestToken(dashboardEmbedId),
          dashboardUiConfig,
        });
      }
    }
  }, [isSuccess, analyticsPublicUrl, dashboardEmbedId]);

  if (!analyticsPublicUrl) {
    console.error('OpenOps Analytics URL is not defined');
    return null;
  }

  return <div className="size-full flex h-full" ref={iframeContainerRef} />;
};

export { OpenOpsAnalyticsPage };
