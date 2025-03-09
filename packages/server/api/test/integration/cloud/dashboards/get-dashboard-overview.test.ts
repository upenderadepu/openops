const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
};

jest.mock('@openops/server-shared', () => ({
  ...jest.requireActual('@openops/server-shared'),
  logger: loggerMock,
}));

const commonMock = {
  ...jest.requireActual('@openops/common'),
  authenticateOpenOpsAnalyticsAdmin: jest.fn(),
};
jest.mock('@openops/common', () => commonMock);

const dashboardMock = {
  getDashboardCharts: jest.fn(),
};
jest.mock(
  '../../../../src/app/openops-analytics/dashboard',
  () => dashboardMock,
);

const chartMock = {
  ...jest.requireActual('../../../../src/app/openops-analytics/chart'),
  getChartData: jest.fn(),
};
jest.mock('../../../../src/app/openops-analytics/chart', () => chartMock);

import { getDashboardOverviewObject } from '../../../../src/app/dashboards/get-dashboard-overview';
import { HOME_PAGE_DASHBOARD_SLUG } from '../../../../src/app/openops-analytics/analytics-seeding-service';

describe('get dashboard overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the expected overview object', async () => {
    commonMock.authenticateOpenOpsAnalyticsAdmin.mockResolvedValue({
      access_token: 'mockAccessToken',
    });
    dashboardMock.getDashboardCharts.mockResolvedValue([
      { id: 1, slice_name: 'unaddressedSavings' },
      { id: 2, slice_name: 'openOpportunities' },
      { id: 3, slice_name: 'realizedSavings' },
      { id: 4, slice_name: 'opportunitiesTableId' },
      { id: 5, slice_name: '' },
    ]);
    chartMock.getChartData
      .mockResolvedValueOnce([{ data: [{ someResult: 123 }] }])
      .mockResolvedValueOnce([{ data: [{ someResult: 456 }] }])
      .mockResolvedValueOnce([{ data: [{ someResult: 789 }] }])
      .mockResolvedValueOnce([{ data: [{ someResult: 100 }] }]);

    const result = await getDashboardOverviewObject();

    expect(result).toEqual({
      unaddressedSavings: 123,
      realizedSavings: 789,
      openOpportunities: 456,
      opportunitiesTableId: 100,
    });

    expect(dashboardMock.getDashboardCharts).toHaveBeenCalledTimes(1);
    expect(dashboardMock.getDashboardCharts).toHaveBeenCalledWith(
      'mockAccessToken',
      HOME_PAGE_DASHBOARD_SLUG,
    );
    expect(chartMock.getChartData).toHaveBeenCalledTimes(4);
    expect(chartMock.getChartData).toHaveBeenNthCalledWith(
      1,
      'mockAccessToken',
      1,
    );
    expect(chartMock.getChartData).toHaveBeenNthCalledWith(
      2,
      'mockAccessToken',
      2,
    );
    expect(chartMock.getChartData).toHaveBeenNthCalledWith(
      3,
      'mockAccessToken',
      3,
    );
    expect(chartMock.getChartData).toHaveBeenNthCalledWith(
      4,
      'mockAccessToken',
      4,
    );
  });

  it('should return undefined when no charts were found on dashboard', async () => {
    commonMock.authenticateOpenOpsAnalyticsAdmin.mockResolvedValue({
      access_token: 'mockAccessToken',
    });
    dashboardMock.getDashboardCharts.mockResolvedValue(null);

    const result = await getDashboardOverviewObject();

    expect(result).toEqual(undefined);
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(
      'Could not get charts for dashboard with slug: homepage',
      { dashboardSlug: 'homepage' },
    );
  });

  it('should handle missing data gracefully', async () => {
    commonMock.authenticateOpenOpsAnalyticsAdmin.mockResolvedValue({
      access_token: 'mockAccessToken',
    });
    dashboardMock.getDashboardCharts.mockResolvedValue([
      { id: 1, slice_name: 'openOpportunities' },
    ]);
    chartMock.getChartData.mockResolvedValue([{ data: [{ someResult: 123 }] }]);

    const result = await getDashboardOverviewObject();

    expect(result).toEqual({
      unaddressedSavings: undefined,
      realizedSavings: undefined,
      opportunitiesTableId: undefined,
      openOpportunities: 123,
    });
    expect(dashboardMock.getDashboardCharts).toHaveBeenCalledTimes(1);
    expect(dashboardMock.getDashboardCharts).toHaveBeenCalledWith(
      'mockAccessToken',
      HOME_PAGE_DASHBOARD_SLUG,
    );
    expect(chartMock.getChartData).toHaveBeenCalledTimes(1);
    expect(chartMock.getChartData).toHaveBeenCalledWith('mockAccessToken', 1);
    expect(loggerMock.error).toHaveBeenCalledTimes(3);
    expect(loggerMock.error).toHaveBeenNthCalledWith(
      1,
      'Cannot get data for chart with name unaddressedSavings as it was not found in list of charts.',
      { chartName: 'unaddressedSavings' },
    );
    expect(loggerMock.error).toHaveBeenNthCalledWith(
      2,
      'Cannot get data for chart with name realizedSavings as it was not found in list of charts.',
      { chartName: 'realizedSavings' },
    );
    expect(loggerMock.error).toHaveBeenNthCalledWith(
      3,
      'Cannot get data for chart with name opportunitiesTableId as it was not found in list of charts.',
      { chartName: 'opportunitiesTableId' },
    );
  });

  it('should throw when chart data cannot be retrieved', async () => {
    dashboardMock.getDashboardCharts.mockResolvedValue([
      { id: 1, slice_name: 'openOpportunities' },
    ]);
    commonMock.authenticateOpenOpsAnalyticsAdmin.mockResolvedValue({
      access_token: 'mockAccessToken',
    });
    chartMock.getChartData.mockReturnValue(undefined);

    await expect(getDashboardOverviewObject()).rejects.toThrow(
      'Failed to get chart with chart name openOpportunities and id 1',
    );
  });
});
