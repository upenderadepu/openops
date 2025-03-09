import { AppSystemProp, system } from '@openops/server-shared';
import { AxiosHeaders } from 'axios';
import { makeOpenOpsAnalyticsPost } from './requests-helpers';

export interface AnalyticsAuthTokens {
  access_token: string;
  refresh_token: string;
}

const OPENOPS_ANALYTICS_ADMIN_USERNAME = 'admin';

export async function authenticateOpenOpsAnalyticsAdmin(): Promise<AnalyticsAuthTokens> {
  const password = system.getOrThrow(AppSystemProp.ANALYTICS_ADMIN_PASSWORD);

  return authenticateOpenOpsAnalyticsUser(
    OPENOPS_ANALYTICS_ADMIN_USERNAME,
    password,
  );
}

async function authenticateOpenOpsAnalyticsUser(
  username: string,
  password: string,
): Promise<AnalyticsAuthTokens> {
  const requestBody = {
    username,
    password,
    provider: 'db',
    refresh: true,
  };

  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
  });

  return makeOpenOpsAnalyticsPost<AnalyticsAuthTokens>(
    'security/login',
    requestBody,
    headers,
  );
}
