import { OPENOPS_DEFAULT_DATABASE_NAME } from '@openops/common';
import { openopsTables, SEED_OPENOPS_TABLE_NAME } from './index';

export async function createDefaultWorkspaceAndDatabase(
  token: string,
): Promise<{ workspaceId: number; databaseId: number }> {
  const workspace = await openopsTables.createWorkspace(
    'OpenOps Workspace',
    token,
  );

  const database = await openopsTables.createDatabase(
    workspace.id,
    OPENOPS_DEFAULT_DATABASE_NAME,
    token,
  );

  const table = await openopsTables.createTable(
    database.id,
    SEED_OPENOPS_TABLE_NAME,
    [['ID']],
    token,
  );

  await openopsTables.addFieldsToOpenopsDefaultTable(token, table.id);

  return {
    workspaceId: workspace.id,
    databaseId: database.id,
  };
}
