import { createAxiosHeaders, makeOpenOpsTablesPost } from '@openops/common';

export type Workspace = {
  id: number;
  name: string;
  order: number;
  permissions: string;
};

export async function createWorkspace(
  workspaceName: string,
  token: string,
): Promise<Workspace> {
  const requestBody = {
    name: workspaceName,
  };

  return makeOpenOpsTablesPost<Workspace>(
    'api/workspaces/',
    requestBody,
    createAxiosHeaders(token),
  );
}
