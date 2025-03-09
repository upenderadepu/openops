import { api } from '@/app/lib/api';
import { DashboardOverview, WorkflowStats } from '@openops/shared';

export const homeApi = {
  getAnalyticsOverview(): Promise<DashboardOverview> {
    return api.get('/v1/dashboards/overview');
  },

  getWorkflowsdOverview(params: {
    createdAfter?: Date;
    createdBefore?: Date;
  }): Promise<WorkflowStats> {
    return api.get('/v1/dashboards/workflows-stats', {
      ...params,
    });
  },
};
