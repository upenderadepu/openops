const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { Application } from '@openops/common';
import { AxiosHeaders } from 'axios';
import { createDatabase } from '../../../src/app/openops-tables/create-database';

describe('createDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the created database on successful creation', async () => {
    const workspaceId = 1;
    const databaseName = 'Test Database';
    const token = 'test_token';
    const mockDatabase: Application = {
      id: 1,
      name: 'Test Database',
      order: 1,
      type: 'database',
      group: { id: 1, name: 'Group 1' },
      workspace: { id: 1, name: 'Workspace 1' },
    };

    openopsCommonMock.makeOpenOpsTablesPost.mockResolvedValue(mockDatabase);

    const result = await createDatabase(workspaceId, databaseName, token);

    expect(result).toEqual(mockDatabase);
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenCalledWith(
      'api/applications/workspace/1/',
      { name: databaseName, type: 'database', init_with_data: false },
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      }),
    );
  });
});
