const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
};
jest.mock('@openops/server-shared', () => ({
  ...jest.requireActual('@openops/server-shared'),
  logger: loggerMock,
}));

const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  createAxiosHeadersForAnalytics: jest.fn(),
  makeOpenOpsAnalyticsPost: jest.fn(),
  makeOpenOpsAnalyticsGet: jest.fn(),
  tryGetResource: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import {
  createDashboard,
  createOrGetDashboard,
  getDashboardCharts,
  getDashboardWithSlugOrId,
} from '../../../src/app/openops-analytics/dashboard';

describe('createDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the created dashboard on successful creation', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 1,
      result: { dashboard_title: 'some dashboard' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await createDashboard(
      'some token',
      'dashboard name',
      'some slug',
    );

    expect(result).toEqual({
      id: 1,
      result: { dashboard_title: 'some dashboard' },
    });
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'dashboard',
      { dashboard_title: 'dashboard name', slug: 'some slug' },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
  });
});

describe('createOrGetDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create dashboard if no slug was provided', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 1,
      result: { dashboard_title: 'some dashboard' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await createOrGetDashboard('some token', 'dashboard name');

    expect(result).toEqual({ id: 1, dashboard_title: 'some dashboard' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).not.toHaveBeenCalled();
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'dashboard',
      { dashboard_title: 'dashboard name', slug: undefined },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Dashboard with name: dashboard name has been created.',
      {
        dashboardId: 1,
        dashboardName: 'dashboard name',
        dashboardSlug: undefined,
      },
    );
  });

  test('should create dashboard if slug was provided but dashboard does not exist', async () => {
    openopsCommonMock.tryGetResource.mockResolvedValue(undefined);
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 1,
      result: { dashboard_title: 'some dashboard' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await createOrGetDashboard(
      'some token',
      'dashboard name',
      'some slug',
    );

    expect(result).toEqual({ id: 1, dashboard_title: 'some dashboard' });
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledWith(
      'some token',
      'dashboard/some slug',
      'dashboard',
    );
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'dashboard',
      { dashboard_title: 'dashboard name', slug: 'some slug' },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('some token');
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Dashboard with name: dashboard name has been created.',
      {
        dashboardId: 1,
        dashboardName: 'dashboard name',
        dashboardSlug: 'some slug',
      },
    );
  });

  test('should return fetched dashboard if slug is given and dashboard exists.', async () => {
    openopsCommonMock.tryGetResource.mockResolvedValue({ id: 1 });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await createOrGetDashboard(
      'some token',
      'dashboard name',
      'some slug',
    );

    expect(result).toEqual({ id: 1 });
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledWith(
      'some token',
      'dashboard/some slug',
      'dashboard',
    );
  });
});

describe('getDashboardWithSlugOrId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should try to get dashboard with slug', async () => {
    openopsCommonMock.tryGetResource.mockResolvedValue({ id: 1 });

    const result = await getDashboardWithSlugOrId('some token', 'some slug');

    expect(result).toEqual({ id: 1 });
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledWith(
      'some token',
      'dashboard/some slug',
      'dashboard',
    );
  });
});

describe('getDashboardCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should try to get dashboard charts', async () => {
    openopsCommonMock.tryGetResource.mockResolvedValue([
      { id: 1, slice_name: 'some name' },
    ]);

    const result = await getDashboardCharts('some token', 'some slug');

    expect(result).toEqual([{ id: 1, slice_name: 'some name' }]);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledWith(
      'some token',
      'dashboard/some slug/charts',
      'dashboard charts',
    );
  });
});
