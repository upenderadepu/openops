import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { openopsTables } from '../index';

export async function createResourceBuTagAssignmentTable(
  databseId: number,
  token: string,
  buTableId: number,
): Promise<{ tableId: number }> {
  const table = await openopsTables.createTable(
    databseId,
    'Resource BU tag assignment',
    [['Resource identifier']],
    token,
  );

  await addFields(token, table.id, buTableId);

  logger.info('[Seeding Resource BU tag assignment table] Done');
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
      name: 'Resource identifier',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  const createFieldEndpoint = `api/database/fields/table/${tableId}/`;

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Resource type',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  const selectOwnerBuField = await makeOpenOpsTablesPost<{ id: number }>(
    createFieldEndpoint,
    {
      name: 'Select owner BU',
      type: 'link_row',
      link_row_table_id: buTableId,
      has_related_field: false,
    },
    createAxiosHeaders(token),
  );

  const buFields = await getFields(buTableId, token);
  const buTargetField = buFields.find((field) => field.name === 'BU code');
  if (buTargetField === undefined) {
    throw new Error(
      '[Seeding Resource BU tag assignment table] BU target field not found in business units table',
    );
  }
  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'BU code',
      type: 'lookup',
      through_field_id: selectOwnerBuField.id,
      target_field_id: buTargetField.id,
    },
    createAxiosHeaders(token),
  );
}
