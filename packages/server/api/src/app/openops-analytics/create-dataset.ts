import {
  createAxiosHeadersForAnalytics,
  makeOpenOpsAnalyticsGet,
  makeOpenOpsAnalyticsPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { AxiosHeaders } from 'axios';

export async function getOrCreateDataset(
  token: string,
  tableName: string,
  databaseId: number,
  schemaName: string,
): Promise<{ id: number }> {
  const authenticationHeader = createAxiosHeadersForAnalytics(token);

  const exists = await getDatasetWithTableName(tableName, authenticationHeader);

  if (exists) {
    return exists;
  }

  const requestBody = {
    database: databaseId,
    table_name: tableName,
    schema: schemaName,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataset = await makeOpenOpsAnalyticsPost<{ id: number; result: any }>(
    'dataset',
    requestBody,
    authenticationHeader,
  );
  logger.info(`Created dataset for table: ${tableName}`, {
    tableName,
    datasetId: dataset.id,
  });
  return { id: dataset.id, ...dataset.result };
}

async function getDatasetWithTableName(
  name: string,
  authenticationHeader: AxiosHeaders,
): Promise<{ id: number }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await makeOpenOpsAnalyticsGet<{ result: any[] }>(
    `dataset?q=(filters:!((col:table_name,opr:eq,value:'${name}')))`,
    authenticationHeader,
  );

  return response && response?.result && response.result.length === 1
    ? { id: response.result[0].id, ...response.result[0] }
    : undefined;
}
