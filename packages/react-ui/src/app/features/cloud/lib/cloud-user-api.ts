import { OPENOPS_CLOUD_USER_INFO_API_URL } from '@/app/constants/cloud';
import { api } from '@/app/lib/api';

export type GetTemplatesParams = {
  search?: string;
  services?: string[];
  domains?: string[];
  blocks?: string[];
  tags?: string[];
};

export type UserInfo = {
  email: string;
};

export const cloudUserApi = {
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      return await api.get<UserInfo>(
        OPENOPS_CLOUD_USER_INFO_API_URL,
        undefined,
        {
          withCredentials: true,
        },
      );
    } catch {
      return null;
    }
  },
  async setUserOriginMetadata({
    origin,
    frontegg,
  }: {
    origin: {
      projectId: string;
      userId: string;
    };
    frontegg: {
      domain: string;
      user: {
        tenantId: string;
        id: string;
        accessToken: string;
        metadata: string;
      };
    };
  }): Promise<void> {
    try {
      const request = {
        metadata: JSON.stringify({
          ...JSON.parse(frontegg.user.metadata),
          projectId: origin.projectId,
          userId: origin.userId,
        }),
      };
      await api.put(
        `${frontegg.domain}/frontegg/identity/resources/users/v1`,
        request,
        null,
        {
          'frontegg-tenant-id': frontegg.user.tenantId,
          'frontegg-user-id': frontegg.user.id,
          Authorization: 'Bearer ' + frontegg.user.accessToken,
        },
      );
    } catch (error) {
      console.error('Unable to update cloud user metadata: ', error);
    }
  },
};
