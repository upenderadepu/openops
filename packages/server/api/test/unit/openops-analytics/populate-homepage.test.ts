const loggerMock = {
  info: jest.fn(),
};
jest.mock('@openops/server-shared', () => ({
  ...jest.requireActual('@openops/server-shared'),
  logger: loggerMock,
}));

const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  createAxiosHeadersForAnalytics: jest.fn(),
};
jest.mock('@openops/common', () => openopsCommonMock);

const chartMock = {
  ...jest.requireActual('../../../src/app/openops-analytics/chart'),
  createChart: jest.fn(),
  getChartByName: jest.fn(),
};
jest.mock('../../../src/app/openops-analytics/chart', () => chartMock);

import { createHomepageCharts } from '../../../src/app/openops-analytics/populate-homepage';

describe('createHomepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create all charts and homepage', async () => {
    await createHomepageCharts('mock-token', 123, 1, 5);

    expect(chartMock.getChartByName).toHaveBeenCalledTimes(4);
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      1,
      'mock-token',
      'openOpportunities',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      2,
      'mock-token',
      'realizedSavings',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      3,
      'mock-token',
      'unaddressedSavings',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      4,
      'mock-token',
      'opportunitiesTableId',
    );

    expect(chartMock.createChart).toHaveBeenCalledTimes(4);

    expect(chartMock.createChart).toHaveBeenNthCalledWith(1, 'mock-token', {
      chartName: 'openOpportunities',
      datasourceId: 123,
      datasourceType: 'table',
      dashboardIds: [1],
      viz_type: 'big_number_total',
      params: JSON.stringify({
        metric: {
          label: 'openOpportunities',
          expressionType: 'SQL',
          sqlExpression: 'COUNT(*)',
        },
        adhoc_filters: [
          {
            clause: 'WHERE',
            expressionType: 'SIMPLE',
            subject: 'Status',
            operator: '!=',
            comparator: 'Closed',
          },
          {
            clause: 'WHERE',
            expressionType: 'SIMPLE',
            subject: 'Status',
            operator: '!=',
            comparator: 'Dismissed',
          },
        ],
        time_range: 'No filter',
      }),
      query_context: JSON.stringify({
        datasource: { id: 123, type: 'table' },
        queries: [
          {
            metrics: [
              {
                label: 'openOpportunities',
                expressionType: 'SQL',
                sqlExpression: 'COUNT(*)',
              },
            ],
            filters: [
              { col: 'Status', op: '!=', val: 'Closed' },
              { col: 'Status', op: '!=', val: 'Dismissed' },
            ],
            time_range: 'No filter',
            is_timeseries: false,
          },
        ],
      }),
      description: 'Number of total open opportunities',
    });

    expect(chartMock.createChart).toHaveBeenNthCalledWith(2, 'mock-token', {
      chartName: 'realizedSavings',
      datasourceId: 123,
      datasourceType: 'table',
      dashboardIds: [1],
      viz_type: 'big_number_total',
      params: JSON.stringify({
        datasource: `${123}__table`,
        viz_type: 'big_number_total',
        metric: {
          label: 'realizedSavings',
          expressionType: 'SQL',
          sqlExpression: 'SUM("Estimated savings USD per month")',
        },
        adhoc_filters: [
          {
            expressionType: 'SIMPLE',
            subject: 'Status',
            operator: '==',
            comparator: 'Closed',
            clause: 'WHERE',
          },
        ],
        time_range: 'last 30 days',
      }),
      query_context: JSON.stringify({
        datasource: { id: 123, type: 'table' },
        queries: [
          {
            metrics: [
              {
                label: 'realizedSavings',
                expressionType: 'SQL',
                sqlExpression: 'SUM("Estimated savings USD per month")',
              },
            ],
            filters: [{ col: 'Status', op: '==', val: 'Closed' }],
            time_range: 'last 30 days',
            is_timeseries: false,
          },
        ],
      }),
      description: 'Sum of total realized savings in the last 30 days',
    });

    expect(chartMock.createChart).toHaveBeenNthCalledWith(3, 'mock-token', {
      chartName: 'unaddressedSavings',
      datasourceId: 123,
      datasourceType: 'table',
      dashboardIds: [1],
      viz_type: 'big_number_total',
      params: JSON.stringify({
        metric: {
          label: 'unaddressedSavings',
          expressionType: 'SQL',
          sqlExpression: 'SUM("Estimated savings USD per month")',
        },
        adhoc_filters: [
          {
            clause: 'WHERE',
            expressionType: 'SIMPLE',
            subject: 'Status',
            operator: '!=',
            comparator: 'Closed',
          },
          {
            clause: 'WHERE',
            expressionType: 'SIMPLE',
            subject: 'Status',
            operator: '!=',
            comparator: 'Dismissed',
          },
        ],
        time_range: 'No filter',
      }),
      query_context: JSON.stringify({
        datasource: { id: 123, type: 'table' },
        queries: [
          {
            metrics: [
              {
                label: 'unaddressedSavings',
                expressionType: 'SQL',
                sqlExpression: 'SUM("Estimated savings USD per month")',
              },
            ],
            filters: [
              { col: 'Status', op: '!=', val: 'Closed' },
              { col: 'Status', op: '!=', val: 'Dismissed' },
            ],
            time_range: 'No filter',
            is_timeseries: false,
          },
        ],
      }),
      description: 'Sum of total unaddressed savings',
    });

    expect(chartMock.createChart).toHaveBeenNthCalledWith(4, 'mock-token', {
      chartName: 'opportunitiesTableId',
      datasourceId: 123,
      datasourceType: 'table',
      dashboardIds: [1],
      viz_type: 'big_number_total',
      params: JSON.stringify({
        metric: {
          label: 'opportunitiesTableId',
          expressionType: 'SQL',
          sqlExpression: '5',
        },
        time_range: 'No filter',
      }),
      query_context: JSON.stringify({
        datasource: { id: 123, type: 'table' },
        queries: [
          {
            metrics: [
              {
                label: 'opportunitiesTableId',
                expressionType: 'SQL',
                sqlExpression: '5',
              },
            ],
            time_range: 'No filter',
            is_timeseries: false,
          },
        ],
      }),
      description: 'Opportunities table ID',
    });
  });

  test('should skip chart creation if charts already exist', async () => {
    chartMock.getChartByName
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 })
      .mockResolvedValueOnce({ id: 3 })
      .mockResolvedValueOnce({ id: 4 });

    await createHomepageCharts('mock-token', 123, 1, 5);

    expect(chartMock.getChartByName).toHaveBeenCalledTimes(4);
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      1,
      'mock-token',
      'openOpportunities',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      2,
      'mock-token',
      'realizedSavings',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      3,
      'mock-token',
      'unaddressedSavings',
    );
    expect(chartMock.getChartByName).toHaveBeenNthCalledWith(
      4,
      'mock-token',
      'opportunitiesTableId',
    );

    expect(chartMock.createChart).not.toHaveBeenCalled();
  });
});
