import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';
import { logger } from '@openops/server-shared';
import { openopsTables } from '../index';

export async function createIdleEbsVolumesToDeleteTable(
  databseId: number,
  token: string,
): Promise<{ tableId: number }> {
  const table = await openopsTables.createTable(
    databseId,
    'Idle EBS Volumes to delete',
    [['Arn']],
    token,
  );

  await addFields(token, table.id);

  logger.info('[Seeding Idle EBS Volumes to delete table] Done');

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
      name: 'Status',
      type: 'single_select',
      select_options: [
        { value: 'New Opportunity', color: 'dark-yellow' },
        { value: 'Delete', color: 'red' },
        { value: 'Deleted', color: 'green' },
        { value: 'Keep', color: 'dark-green' },
      ],
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Region',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Account',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Cost USD per month',
      type: 'number',
      number_decimal_places: 2,
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Name',
      type: 'text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Owner',
      type: 'email',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Is attached?',
      type: 'boolean',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Volume details',
      type: 'long_text',
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
