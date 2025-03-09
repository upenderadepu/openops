const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { AxiosHeaders } from 'axios';
import {
  createWorkspace,
  Workspace,
} from '../../../src/app/openops-tables/create-workspace';

describe('createWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the created workspace on successful creation', async () => {
    const workspaceName = 'Test Workspace';
    const token = 'test_token';
    const mockWorkspace: Workspace = {
      id: 1,
      name: 'Test Workspace',
      order: 1,
      permissions: 'read-write',
    };

    openopsCommonMock.makeOpenOpsTablesPost.mockResolvedValue(mockWorkspace);

    const result = await createWorkspace(workspaceName, token);

    expect(result).toEqual(mockWorkspace);
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenCalledWith(
      'api/workspaces/',
      { name: workspaceName },
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      }),
    );
  });
});
