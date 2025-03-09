/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAxiosHeadersForAnalytics,
  makeOpenOpsAnalyticsGet,
  makeOpenOpsAnalyticsPost,
  tryGetResource,
} from '@openops/common';
import { logger } from '@openops/server-shared';

export enum DataSourceType {
  sl_table = 'sl_table',
  table = 'table',
  dataset = 'dataset',
  query = 'query',
  saved_query = 'saved_query',
  view = 'view',
}

export type CreateChartParams = {
  chartName: string;
  datasourceId: number;
  datasourceType: DataSourceType;
  dashboardIds: number[];
  viz_type?: string;
  params?: string;
  description?: string;
  query_context?: string;
};

export async function createChart(
  token: string,
  params: CreateChartParams,
): Promise<{ id: number }> {
  const authenticationHeader = createAxiosHeadersForAnalytics(token);

  const requestBody = {
    datasource_id: params.datasourceId,
    datasource_type: params.datasourceType,
    slice_name: params.chartName,
    dashboards: params.dashboardIds,
    params: params.params,
    query_context: params.query_context,
    viz_type: params.viz_type,
    description: params.description,
  };

  const chart = await makeOpenOpsAnalyticsPost<{ id: number; result: any }>(
    'chart',
    requestBody,
    authenticationHeader,
  );
  logger.info(`Created chart for datasource_id: ${params.datasourceId}`, {
    datasourceId: params.datasourceId,
    sliceId: chart.id,
  });
  return { id: chart.id, ...chart.result };
}

export async function getChartByName(
  token: string,
  name: string,
): Promise<{ id: number }> {
  const authenticationHeader = createAxiosHeadersForAnalytics(token);

  const response = await makeOpenOpsAnalyticsGet<{ result: any[] }>(
    `chart?q=(filters:!((col:slice_name,opr:eq,value:'${name}')))`,
    authenticationHeader,
  );

  return response && response?.result && response.result.length !== 0
    ? { id: response.result[0].id, ...response.result[0] }
    : undefined;
}

export async function getChartData(
  token: string,
  id: number,
): Promise<{ id: number; data: any }[] | undefined> {
  return tryGetResource<{ id: number; data: any }[]>(
    token,
    `chart/${id}/data?force=true`,
    'chart data',
  );
}
