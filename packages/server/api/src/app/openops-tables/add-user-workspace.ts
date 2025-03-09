import { createAxiosHeaders, makeOpenOpsTablesPost } from '@openops/common';

export async function addUserToWorkspace(
  token: string,
  values: {
    email: string;
    workspaceId: number;
    permissions?: 'MEMBER' | 'ADMIN';
  },
): Promise<{ name: string; id: number }> {
  const requestBody = {
    email: values.email,
    permissions: values.permissions ?? 'MEMBER',
  };

  return makeOpenOpsTablesPost<{ name: string; id: number }>(
    `api/workspaces/${values.workspaceId}/user/`,
    requestBody,
    createAxiosHeaders(token),
  );
}
