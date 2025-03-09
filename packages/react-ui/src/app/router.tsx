import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

import { PageTitle } from '@/app/common/components/page-title';
import ProjectSettingsLayout from '@/app/common/components/project-settings-layout';
import { VerifyEmail } from '@/app/features/authentication/components/verify-email';
import { RedirectPage } from '@/app/routes/redirect';
import { FlowRunsPage } from '@/app/routes/runs';
import { ProjectBlocksPage } from '@/app/routes/settings/blocks';

import { FlowsPage } from '../app/routes/flows';

import { PageHeader } from '@openops/components/ui';
import { t } from 'i18next';

import { flagsHooks } from '@/app/common/hooks/flags-hooks';
import { FlowsPageHeader } from '@/app/features/flows/components/flows-page-header';
import { HomeHelpDropdown } from '@/app/features/home/components/home-help-dropdown';
import { FlagId } from '@openops/shared';
import { lazy, Suspense } from 'react';
import { AllowOnlyLoggedInUserOnlyGuard } from './common/guards/allow-logged-in-user-only-guard';
import { ConnectionsHeader } from './features/connections/components/connection-table';
import { ConnectionsProvider } from './features/connections/components/connections-context';
import { DashboardContainer } from './features/navigation/dashboard-container';
import NotFoundPage from './routes/404-page';
import { ChangePasswordPage } from './routes/change-password';
import AppConnectionsPage from './routes/connections';
import { FlowBuilderPage } from './routes/flows/id';
import { ResetPasswordPage } from './routes/forget-password';
import { HomePage } from './routes/home';
import { HomeDemoPage, HomeDemoPageHeader } from './routes/home-demo';
import { OpenOpsAnalyticsPage } from './routes/openops-analytics';
import { OpenOpsTablesPage } from './routes/openops-tables';
import { FlowRunPage } from './routes/runs/id';
import AppearancePage from './routes/settings/appearance';
import GeneralPage from './routes/settings/general';
import { SignInPage } from './routes/sign-in';
import { SignUpPage } from './routes/sign-up';

const SettingsRerouter = () => {
  const { hash } = useLocation();
  const fragmentWithoutHash = hash.slice(1).toLowerCase();
  return fragmentWithoutHash ? (
    <Navigate to={`/settings/${fragmentWithoutHash}`} replace />
  ) : (
    <Navigate to="/settings/general" replace />
  );
};

const createRoutes = () => {
  const { data: isCloudConnectionPageEnabled } = flagsHooks.useFlag<any>(
    FlagId.CLOUD_CONNECTION_PAGE_ENABLED,
  );

  const { data: isDemoHomePage } = flagsHooks.useFlag<any>(
    FlagId.SHOW_DEMO_HOME_PAGE,
  );

  const routes = [
    {
      path: '/flows',
      element: (
        <DashboardContainer
          pageHeader={<FlowsPageHeader title={t('Workflows')} />}
        >
          <PageTitle title="Workflows">
            <FlowsPage />
          </PageTitle>
        </DashboardContainer>
      ),
    },
    {
      path: '/flows/:flowId',
      element: (
        <AllowOnlyLoggedInUserOnlyGuard>
          <PageTitle title="Builder">
            <FlowBuilderPage />
          </PageTitle>
        </AllowOnlyLoggedInUserOnlyGuard>
      ),
    },
    {
      path: '/runs/:runId',
      element: (
        <AllowOnlyLoggedInUserOnlyGuard>
          <PageTitle title="Workflow Run">
            <FlowRunPage />
          </PageTitle>
        </AllowOnlyLoggedInUserOnlyGuard>
      ),
    },
    {
      path: '/runs',
      element: (
        <DashboardContainer
          pageHeader={<PageHeader title={t('Workflow Runs')} />}
        >
          <PageTitle title="Runs">
            <FlowRunsPage />
          </PageTitle>
        </DashboardContainer>
      ),
    },
    {
      path: '/connections',
      element: (
        <ConnectionsProvider>
          <DashboardContainer pageHeader={<ConnectionsHeader />}>
            <PageTitle title="Connections">
              <AppConnectionsPage />
            </PageTitle>
          </DashboardContainer>
        </ConnectionsProvider>
      ),
    },
    {
      path: '/settings',
      element: (
        <DashboardContainer pageHeader={<PageHeader title={t('Settings')} />}>
          <SettingsRerouter />
        </DashboardContainer>
      ),
    },
    {
      path: '/forget-password',
      element: (
        <PageTitle title="Forget Password">
          <ResetPasswordPage />
        </PageTitle>
      ),
    },
    {
      path: '/reset-password',
      element: (
        <PageTitle title="Reset Password">
          <ChangePasswordPage />
        </PageTitle>
      ),
    },
    {
      path: '/sign-in',
      element: (
        <PageTitle title="Sign In">
          <SignInPage />
        </PageTitle>
      ),
    },
    {
      path: '/verify-email',
      element: (
        <PageTitle title="Verify Email">
          <VerifyEmail />
        </PageTitle>
      ),
    },
    {
      path: '/sign-up',
      element: (
        <PageTitle title="Sign Up">
          <SignUpPage />
        </PageTitle>
      ),
    },
    {
      path: '/settings/appearance',
      element: (
        <DashboardContainer pageHeader={<PageHeader title={t('Settings')} />}>
          <ProjectSettingsLayout>
            <PageTitle title="Appearance">
              <AppearancePage />
            </PageTitle>
          </ProjectSettingsLayout>
        </DashboardContainer>
      ),
    },
    {
      path: '/settings/general',
      element: (
        <DashboardContainer pageHeader={<PageHeader title={t('Settings')} />}>
          <ProjectSettingsLayout>
            <PageTitle title="General">
              <GeneralPage />
            </PageTitle>
          </ProjectSettingsLayout>
        </DashboardContainer>
      ),
    },
    {
      path: '/settings/blocks',
      element: (
        <DashboardContainer pageHeader={<PageHeader title={t('Settings')} />}>
          <ProjectSettingsLayout>
            <PageTitle title="Blocks">
              <ProjectBlocksPage />
            </PageTitle>
          </ProjectSettingsLayout>
        </DashboardContainer>
      ),
    },
    {
      path: '/tables',
      element: (
        <DashboardContainer
          useEntireInnerViewport
          pageHeader={<PageHeader title={t('Tables')} />}
        >
          <PageTitle title="Tables">
            <OpenOpsTablesPage />
          </PageTitle>
        </DashboardContainer>
      ),
    },
    {
      path: '/analytics',
      element: (
        <DashboardContainer useEntireInnerViewport>
          <PageTitle title="Analytics">
            <OpenOpsAnalyticsPage />
          </PageTitle>
        </DashboardContainer>
      ),
    },
    {
      path: '/404',
      element: (
        <PageTitle title="Not Found">
          <NotFoundPage />
        </PageTitle>
      ),
    },
    {
      path: '/redirect',
      element: <RedirectPage></RedirectPage>,
    },
    {
      path: '/*',
      element: (
        <PageTitle title="Redirect">
          <Navigate to={'/'} replace />
        </PageTitle>
      ),
    },
  ];

  if (isCloudConnectionPageEnabled) {
    const CloudConnectionPage = lazy(
      () => import('@/app/routes/cloud-connection'),
    );
    const CloudLogoutPage = lazy(
      () => import('@/app/routes/cloud-connection/cloud-logout-page'),
    );

    routes.push({
      path: '/connect',
      element: (
        <Suspense>
          <CloudConnectionPage />
        </Suspense>
      ),
    });
    routes.push({
      path: '/oauth/callback',
      element: (
        <Suspense>
          <CloudConnectionPage />
        </Suspense>
      ),
    });
    routes.push({
      path: '/oauth/logout',
      element: (
        <Suspense>
          <CloudLogoutPage />
        </Suspense>
      ),
    });
  }

  if (!isDemoHomePage) {
    routes.push({
      path: '/',
      element: (
        <DashboardContainer
          pageHeader={
            <FlowsPageHeader title={t('Overview')}>
              <HomeHelpDropdown />
            </FlowsPageHeader>
          }
        >
          <PageTitle title="Home">
            <HomePage />
          </PageTitle>
        </DashboardContainer>
      ),
    });
  } else {
    routes.push({
      path: '/',
      element: (
        <DashboardContainer pageHeader={<HomeDemoPageHeader />}>
          <PageTitle title="Home">
            <HomeDemoPage />
          </PageTitle>
        </DashboardContainer>
      ),
    });
  }

  return routes;
};

const ApplicationRouter = () => {
  const router = createBrowserRouter(createRoutes());
  return <RouterProvider router={router}></RouterProvider>;
};

export { ApplicationRouter };
