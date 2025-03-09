import {
  fetchFinopsDashboardEmbedDetails,
  fetchGuestTokenInOpenOpsAnalytics,
} from '@openops/common';

export const analyticsDashboardService = {
  async fetchFinopsDashboardEmbedId(accessToken: string): Promise<string> {
    const {
      result: { uuid: dashboardEmbedId },
    } = await fetchFinopsDashboardEmbedDetails(accessToken);

    return dashboardEmbedId;
  },
  async fetchDashboardGuestToken(
    accessToken: string,
    dashboardEmbedUuid: string,
  ): Promise<string> {
    const { token } = await fetchGuestTokenInOpenOpsAnalytics(
      accessToken,
      dashboardEmbedUuid,
    );
    return token;
  },
};
