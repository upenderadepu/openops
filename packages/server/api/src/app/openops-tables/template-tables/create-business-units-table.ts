import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { openopsTables } from '../index';

export async function createBusinessUnitsTable(
  databseId: number,
  token: string,
): Promise<{ tableId: number }> {
  const table = await openopsTables.createTable(
    databseId,
    'Business units',
    [['BU name']],
    token,
  );

  await addFields(token, table.id);

  logger.info('[Seeding Business units table] Done');

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
      name: 'BU name',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  const createFieldEndpoint = `api/database/fields/table/${tableId}/`;
  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'BU code',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Notes',
      type: 'long_text',
    },
    createAxiosHeaders(token),
  );
}
