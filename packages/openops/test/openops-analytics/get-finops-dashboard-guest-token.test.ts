const makeOpenOpsAnalyticsPost = jest.fn();
jest.mock('../../src/lib/openops-analytics/requests-helpers', () => {
  return { makeOpenOpsAnalyticsPost };
});

import { AxiosHeaders } from 'axios';
import { fetchGuestTokenInOpenOpsAnalytics } from '../../src/lib/openops-analytics/finops-dashboard';

describe('Fetch Openops Analytics guest token', () => {
  const dashboardEmbedUuidMock = 'test-dashboard-uuid';

  const expectedEmbedDetails = {
    resources: [
      {
        type: 'dashboard',
        id: dashboardEmbedUuidMock,
      },
    ],
    rls: [],
    user: {
      username: 'openops_user',
      first_name: 'OpenOps',
      last_name: 'User',
    },
  };

  const token = 'test_token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return guest token on successful Analytics POST call', async () => {
    makeOpenOpsAnalyticsPost.mockResolvedValue({
      token,
    });

    const result = await fetchGuestTokenInOpenOpsAnalytics(
      token,
      dashboardEmbedUuidMock,
    );

    expect(result).toEqual({ token });
    expect(makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'security/guest_token/',
      expectedEmbedDetails,
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    );
  });

  it('should log an error and throw an exception on failed Analytics POST call', async () => {
    const errorMessage = 'Something went wrong';

    makeOpenOpsAnalyticsPost.mockRejectedValue(new Error(errorMessage));

    await expect(
      fetchGuestTokenInOpenOpsAnalytics(token, dashboardEmbedUuidMock),
    ).rejects.toThrow(errorMessage);

    expect(makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'security/guest_token/',
      expectedEmbedDetails,
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    );
  });
});
