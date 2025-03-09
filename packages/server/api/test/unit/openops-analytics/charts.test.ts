const axiosMock = {
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
};
jest.mock('axios', () => axiosMock);

const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  createAxiosHeadersForAnalytics: jest.fn(),
  makeOpenOpsAnalyticsPost: jest.fn(),
  makeOpenOpsAnalyticsGet: jest.fn(),
  tryGetResource: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

import {
  createChart,
  DataSourceType,
  getChartByName,
  getChartData,
} from '../../../src/app/openops-analytics/chart';

describe('createChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a chart successfully and return its ID', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsPost.mockResolvedValue({
      id: 42,
      result: { someProperty: 'mock chart' },
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const params = {
      chartName: 'Mock Chart',
      datasourceId: 123,
      datasourceType: DataSourceType.table,
      dashboardIds: [1, 2, 3],
      viz_type: 'bar_chart',
      params: '{"filter": "mock"}',
      description: 'A mock chart for testing',
      query_context: '{"context": "mock"}',
    };

    const result = await createChart('mock-token', params);

    expect(result).toEqual({ id: 42, someProperty: 'mock chart' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsPost).toHaveBeenCalledWith(
      'chart',
      {
        datasource_id: 123,
        datasource_type: DataSourceType.table,
        slice_name: 'Mock Chart',
        dashboards: [1, 2, 3],
        params: '{"filter": "mock"}',
        query_context: '{"context": "mock"}',
        viz_type: 'bar_chart',
        description: 'A mock chart for testing',
      },
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('mock-token');
  });
});

describe('getChartByName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a chart if it exists', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsGet.mockResolvedValue({
      result: [{ id: 7, someProperty: 'mock chart' }],
    });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await getChartByName('mock-token', 'Mock Chart');

    expect(result).toEqual({ id: 7, someProperty: 'mock chart' });
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      `chart?q=(filters:!((col:slice_name,opr:eq,value:'Mock Chart')))`,
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('mock-token');
  });

  test('should return undefined if no chart exists', async () => {
    openopsCommonMock.makeOpenOpsAnalyticsGet.mockResolvedValue({ result: [] });
    openopsCommonMock.createAxiosHeadersForAnalytics.mockReturnValue(
      'some header',
    );

    const result = await getChartByName('mock-token', 'Nonexistent Chart');

    expect(result).toBeUndefined();
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.makeOpenOpsAnalyticsGet).toHaveBeenCalledWith(
      `chart?q=(filters:!((col:slice_name,opr:eq,value:'Nonexistent Chart')))`,
      'some header',
    );
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledTimes(1);
    expect(
      openopsCommonMock.createAxiosHeadersForAnalytics,
    ).toHaveBeenCalledWith('mock-token');
  });
});

describe('getChartData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return try get resource result', async () => {
    openopsCommonMock.tryGetResource.mockResolvedValue({ id: 1, data: [] });

    const result = await getChartData('some token', 123);

    expect(result).toEqual({ id: 1, data: [] });
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.tryGetResource).toHaveBeenCalledWith(
      'some token',
      'chart/123/data?force=true',
      'chart data',
    );
  });
});
