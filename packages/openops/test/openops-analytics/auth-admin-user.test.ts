const mockAdminPassword = 'password123';

const systemMock = {
  getOrThrow: jest.fn().mockImplementation((key: string) => {
    if (key === 'ANALYTICS_ADMIN_PASSWORD') {
      return mockAdminPassword;
    }
    return '';
  }),
};

jest.mock('@openops/server-shared', () => ({
  system: systemMock,
  AppSystemProp: {
    ANALYTICS_ADMIN_PASSWORD: 'ANALYTICS_ADMIN_PASSWORD',
  },
}));

const makeOpenOpsAnalyticsPost = jest.fn();
jest.mock('../../src/lib/openops-analytics/requests-helpers', () => {
  return { makeOpenOpsAnalyticsPost };
});

import { AxiosHeaders } from 'axios';
import { authenticateOpenOpsAnalyticsAdmin } from '../../src/lib/openops-analytics/auth-user';

describe('Auth Analytics Admin User', () => {
  const expectedAdminUsername = 'admin';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tokens on successful authentication', async () => {
    const token = 'test_token';
    const refresh_token = 'test_refresh_token';

    makeOpenOpsAnalyticsPost.mockResolvedValue({
      token,
      refresh_token,
    });

    const result = await authenticateOpenOpsAnalyticsAdmin();

    expect(result).toEqual({ token, refresh_token });
    expect(makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'security/login',
      {
        password: mockAdminPassword,
        refresh: true,
        provider: 'db',
        username: expectedAdminUsername,
      },
      new AxiosHeaders({ 'Content-Type': 'application/json' }),
    );
  });

  it('should log an error and throw an exception on failed authentication', async () => {
    const errorMessage = 'Authentication failed';

    makeOpenOpsAnalyticsPost.mockRejectedValue(new Error(errorMessage));

    await expect(authenticateOpenOpsAnalyticsAdmin()).rejects.toThrow(
      errorMessage,
    );

    expect(makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'security/login',
      {
        password: mockAdminPassword,
        refresh: true,
        provider: 'db',
        username: expectedAdminUsername,
      },
      new AxiosHeaders({ 'Content-Type': 'application/json' }),
    );
  });
});
