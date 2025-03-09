const makeOpenOpsAnalyticsGet = jest.fn();
jest.mock('../../src/lib/openops-analytics/requests-helpers', () => {
  return { makeOpenOpsAnalyticsGet };
});

import { AxiosHeaders } from 'axios';
import { fetchFinopsDashboardEmbedDetails } from '../../src/lib/openops-analytics/finops-dashboard';

describe('Fetch Openops Analytics embed details', () => {
  const token = 'test_token';

  const embedDetailsResponseMock = {
    result: {
      uuid: 'test_uuid',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return embed details on successful Analytics GET call', async () => {
    makeOpenOpsAnalyticsGet.mockResolvedValue(embedDetailsResponseMock);

    const result = await fetchFinopsDashboardEmbedDetails(token);

    expect(result).toEqual(embedDetailsResponseMock);
    expect(makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      'dashboard/finops/embedded',
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    );
  });

  it('should log an error and throw an exception on failed Analytics GET call', async () => {
    const errorMessage = 'Something went wrong';

    makeOpenOpsAnalyticsGet.mockRejectedValue(new Error(errorMessage));

    await expect(fetchFinopsDashboardEmbedDetails(token)).rejects.toThrow(
      errorMessage,
    );

    expect(makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      'dashboard/finops/embedded',
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    );
  });
});
