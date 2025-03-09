import {
  createAxiosHeadersForAnalytics,
  makeOpenOpsAnalyticsPost,
} from '@openops/common';
import { logger, SharedSystemProp, system } from '@openops/server-shared';

export async function enableEmbeddedMode(
  token: string,
  id: number | undefined,
): Promise<{ result: unknown } | undefined> {
  if (!id) {
    logger.error('Not enabling embeded mode as provided ID is undefined.');
    return undefined;
  }

  const authenticationHeader = createAxiosHeadersForAnalytics(token);

  const requestBody = {
    allowed_domains: [system.getOrThrow(SharedSystemProp.FRONTEND_URL)],
  };

  logger.info(`Enabling embedded mode for dashboard with id: ${id}.`, {
    dashboardId: id,
  });
  return makeOpenOpsAnalyticsPost<{ result: unknown }>(
    `dashboard/${id}/embedded`,
    requestBody,
    authenticationHeader,
  );
}
