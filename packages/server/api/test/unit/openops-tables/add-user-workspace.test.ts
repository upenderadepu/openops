const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { createAxiosHeaders } from '@openops/common';
import { addUserToWorkspace } from '../../../src/app/openops-tables/add-user-workspace';

describe('addUserToWorkspace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add the user to the workspace successfully', async () => {
    const userDetails = {
      email: 'test@example.com',
      workspaceId: 1,
    };
    const mockResponse = {
      name: 'Workspace',
      id: 1,
    };

    openopsCommonMock.makeOpenOpsTablesPost.mockImplementation(() => {
      return mockResponse;
    });

    const response = await addUserToWorkspace('token', userDetails);

    expect(response).toEqual(mockResponse);
    expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenCalledWith(
      'api/workspaces/1/user/',
      {
        email: userDetails.email,
        permissions: 'MEMBER',
      },
      createAxiosHeaders('token'),
    );
  });
});
