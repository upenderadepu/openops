import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { openopsTables } from '../index';

export async function createTagOwnerMappingTable(
  databseId: number,
  token: string,
  buTableId: number,
): Promise<{ tableId: number }> {
  const table = await openopsTables.createTable(
    databseId,
    'Tag-Owner mapping',
    [['Owner tag value']],
    token,
  );

  await addFields(token, table.id, buTableId);

  logger.info('[Seeding Tag-Owner mapping table] Done');

  return {
    tableId: table.id,
  };
}

export async function addFields(
  token: string,
  tableId: number,
  buTableId: number,
) {
  const fields = await getFields(tableId, token);
  const primaryField = getPrimaryKeyFieldFromFields(fields);

  await makeOpenOpsTablesPatch<unknown>(
    `api/database/fields/${primaryField.id}/`,
    {
      name: 'Owner tag value',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  const createFieldEndpoint = `api/database/fields/table/${tableId}/`;
  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Owner email',
      type: 'email',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'BU',
      type: 'link_row',
      link_row_table_id: buTableId,
    },
    createAxiosHeaders(token),
  );
}
