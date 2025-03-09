import {
  createAxiosHeadersForAnalytics,
  makeOpenOpsAnalyticsPost,
  tryGetResource,
} from '@openops/common';
import { logger } from '@openops/server-shared';

export async function createOrGetDashboard(
  token: string,
  name: string,
  slug?: string,
): Promise<{ id: number }> {
  if (slug) {
    const exists = await getDashboardWithSlugOrId(token, slug);

    if (exists) {
      return exists;
    }
  }

  const dashboard = await createDashboard(token, name, slug);
  logger.info(`Dashboard with name: ${name} has been created.`, {
    dashboardName: name,
    dashboardSlug: slug,
    dashboardId: dashboard.id,
  });
  return { id: dashboard.id, ...dashboard.result };
}

export async function createDashboard(
  token: string,
  name: string,
  slug?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ id: number; result: any }> {
  const authenticationHeader = createAxiosHeadersForAnalytics(token);

  const requestBody = {
    dashboard_title: name,
    slug,
  };

  return makeOpenOpsAnalyticsPost<{ id: number; result: unknown }>(
    'dashboard',
    requestBody,
    authenticationHeader,
  );
}

export async function getDashboardWithSlugOrId(
  token: string,
  slugOrId: string,
): Promise<{ id: number } | undefined> {
  return tryGetResource<{ id: number }>(
    token,
    `dashboard/${slugOrId}`,
    'dashboard',
  );
}

export async function getDashboardCharts(
  token: string,
  slugOrId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ id: number; slice_name: string }[] | undefined> {
  return tryGetResource<{ id: number; slice_name: string }[]>(
    token,
    `dashboard/${slugOrId}/charts`,
    'dashboard charts',
  );
}
