import { createChart, DataSourceType, getChartByName } from './chart';

export async function createHomepageCharts(
  token: string,
  datasetId: number,
  homepageId: number,
  tableId: number,
): Promise<void> {
  await createOrGetChart(
    token,
    datasetId,
    homepageId,
    'openOpportunities',
    'Number of total open opportunities',
    {
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
    },
    {
      datasource: { id: datasetId, type: 'table' },
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
    },
  );

  await createOrGetChart(
    token,
    datasetId,
    homepageId,
    'realizedSavings',
    'Sum of total realized savings in the last 30 days',
    {
      datasource: `${datasetId}__table`,
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
    },
    {
      datasource: { id: datasetId, type: 'table' },
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
    },
  );

  await createOrGetChart(
    token,
    datasetId,
    homepageId,
    'unaddressedSavings',
    'Sum of total unaddressed savings',
    {
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
    },
    {
      datasource: { id: datasetId, type: 'table' },
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
    },
  );

  await createOrGetChart(
    token,
    datasetId,
    homepageId,
    'opportunitiesTableId',
    'Opportunities table ID',
    {
      metric: {
        label: 'opportunitiesTableId',
        expressionType: 'SQL',
        sqlExpression: `${tableId}`,
      },
      time_range: 'No filter',
    },
    {
      datasource: { id: datasetId, type: 'table' },
      queries: [
        {
          metrics: [
            {
              label: 'opportunitiesTableId',
              expressionType: 'SQL',
              sqlExpression: `${tableId}`,
            },
          ],
          time_range: 'No filter',
          is_timeseries: false,
        },
      ],
    },
  );
}

async function createOrGetChart(
  token: string,
  datasetId: number,
  dashboardId: number,
  chartName: string,
  chartDescription: string,
  chartParams: object,
  queryContext?: object,
): Promise<{ id: number }> {
  const exists = await getChartByName(token, chartName);
  if (exists) {
    return exists;
  }

  return createChart(token, {
    chartName,
    datasourceId: datasetId,
    datasourceType: DataSourceType.table,
    dashboardIds: [dashboardId],
    viz_type: 'big_number_total',
    params: JSON.stringify(chartParams),
    description: chartDescription,
    query_context: JSON.stringify(queryContext),
  });
}
