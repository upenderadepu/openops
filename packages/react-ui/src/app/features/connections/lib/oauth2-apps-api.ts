import { api } from '@/app/lib/api';

export const oauthAppsApi = {
  listCloudOAuthApps(
    oauthProxyUrl: string | null,
  ): Promise<Record<string, { clientId: string }>> {
    return api.get<Record<string, { clientId: string }>>(
      `${oauthProxyUrl}/apps`,
    );
  },
};
