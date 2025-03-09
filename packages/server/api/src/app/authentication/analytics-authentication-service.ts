import {
  AnalyticsAuthTokens,
  authenticateOpenOpsAnalyticsAdmin,
} from '@openops/common';
import { seedAnalyticsDashboards } from '../openops-analytics/analytics-seeding-service';

export const analyticsAuthenticationService = {
  async signUp(): Promise<AnalyticsAuthTokens> {
    await seedAnalyticsDashboards();

    return authenticateOpenOpsAnalyticsAdmin();
  },

  async signIn(): Promise<AnalyticsAuthTokens> {
    return authenticateOpenOpsAnalyticsAdmin();
  },
};
