import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { openopsTables } from '../index';

export async function createAutoEc2InstancesShutdownTable(
  databseId: number,
  token: string,
): Promise<{ tableId: number }> {
  const table = await openopsTables.createTable(
    databseId,
    'Auto EC2 instances shutdown',
    [['Arn']],
    token,
  );

  await addFields(token, table.id);

  logger.info('[Seeding Auto EC2 instances shutdown table] Done');

  return {
    tableId: table.id,
  };
}

export async function addFields(token: string, tableId: number) {
  const fields = await getFields(tableId, token);
  const primaryField = getPrimaryKeyFieldFromFields(fields);

  await makeOpenOpsTablesPatch<unknown>(
    `api/database/fields/${primaryField.id}/`,
    {
      name: 'Arn',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  const createFieldEndpoint = `api/database/fields/table/${tableId}/`;
  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Shutdown time',
      type: 'date',
      date_format: 'ISO',
      date_include_time: true,
    },
    createAxiosHeaders(token),
  );
}
