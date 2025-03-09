const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  makeOpenOpsTablesPost: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import { User } from '@openops/common';
import { createUser } from '../../../src/app/openops-tables/create-user';

describe('createUserInOpenOpsTables', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [true, { token: 'token', refresh_token: 'refresh_token' }],
    [false, {}],
  ])(
    'should return the created user on successful creation',
    async (
      authenticate: boolean,
      expectedResult: { token?: string; refresh_token?: string },
    ) => {
      const userDetails = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        authenticate,
      };
      const mockUser: User = {
        first_name: 'Test',
        username: 'TestUser',
        id: 1,
      };

      openopsCommonMock.makeOpenOpsTablesPost.mockImplementation(() => {
        if (authenticate) {
          return {
            user: mockUser,
            ...expectedResult,
          };
        }
        return {
          user: mockUser,
        };
      });

      const { user, token, refresh_token } = await createUser(userDetails);

      expect(user).toEqual(mockUser);
      expect(token).toEqual(expectedResult?.token);
      expect(refresh_token).toEqual(expectedResult?.refresh_token);

      expect(openopsCommonMock.makeOpenOpsTablesPost).toHaveBeenCalledWith(
        'api/user/',
        {
          name: userDetails.name,
          email: userDetails.email,
          password: userDetails.password,
          authenticate,
        },
      );
    },
  );
});
