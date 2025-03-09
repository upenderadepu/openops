import {
  Application,
  createAxiosHeaders,
  makeOpenOpsTablesPost,
} from '@openops/common';

export async function createDatabase(
  workspaceId: number,
  databaseName: string,
  token: string,
): Promise<Application> {
  const requestBody = {
    name: databaseName,
    type: 'database',
    init_with_data: false,
  };

  return makeOpenOpsTablesPost<Application>(
    `api/applications/workspace/${workspaceId}/`,
    requestBody,
    createAxiosHeaders(token),
  );
}
