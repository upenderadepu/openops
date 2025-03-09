import {
  createAxiosHeaders,
  getFields,
  getPrimaryKeyFieldFromFields,
  makeOpenOpsTablesPatch,
  makeOpenOpsTablesPost,
} from '@openops/common';

export async function addFieldsToOpenopsDefaultTable(
  token: string,
  tableId: number,
) {
  const fields = await getFields(tableId, token);
  const primaryField = getPrimaryKeyFieldFromFields(fields);

  await makeOpenOpsTablesPatch<unknown>(
    `api/database/fields/${primaryField.id}/`,
    {
      name: 'ID',
      type: 'uuid',
    },
    createAxiosHeaders(token),
  );

  const createFieldEndpoint = `api/database/fields/table/${tableId}/`;
  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Resource ID',
      type: 'long_text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Workflow name',
      type: 'long_text',
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Creation time',
      type: 'created_on',
      date_format: 'ISO',
      date_include_time: true,
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Last modified time',
      type: 'last_modified',
      date_format: 'ISO',
      date_include_time: true,
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Status',
      type: 'single_select',
      select_options: [
        { value: 'Created', color: 'blue' },
        { value: 'Approved', color: 'green' },
        { value: 'Snoozed', color: 'light-yellow' },
        { value: 'Dismissed', color: 'red' },
        { value: 'Closed', color: 'gray' },
      ],
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Snoozed until',
      type: 'date',
      date_format: 'ISO',
      date_include_time: true,
    },
    createAxiosHeaders(token),
  );

  await makeOpenOpsTablesPost<unknown>(
    createFieldEndpoint,
    {
      name: 'Estimated savings USD per month',
      type: 'number',
      number_decimal_places: 2,
    },
    createAxiosHeaders(token),
  );
}
