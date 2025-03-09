/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateOpenOpsAnalyticsAdmin } from '@openops/common';
import { logger } from '@openops/server-shared';
import { DashboardOverview } from '@openops/shared';
import { HOME_PAGE_DASHBOARD_SLUG } from '../openops-analytics/analytics-seeding-service';
import { getChartData } from '../openops-analytics/chart';
import { getDashboardCharts } from '../openops-analytics/dashboard';

export async function getDashboardOverviewObject(): Promise<
  DashboardOverview | undefined
> {
  const { access_token } = await authenticateOpenOpsAnalyticsAdmin();
  const charts = await getDashboardCharts(
    access_token,
    HOME_PAGE_DASHBOARD_SLUG,
  );
  if (!charts) {
    logger.error(
      `Could not get charts for dashboard with slug: ${HOME_PAGE_DASHBOARD_SLUG}`,
      { dashboardSlug: HOME_PAGE_DASHBOARD_SLUG },
    );
    return undefined;
  }

  return {
    unaddressedSavings: await getDataForChart(
      access_token,
      'unaddressedSavings',
      charts,
    ),
    openOpportunities: await getDataForChart(
      access_token,
      'openOpportunities',
      charts,
    ),
    realizedSavings: await getDataForChart(
      access_token,
      'realizedSavings',
      charts,
    ),
    opportunitiesTableId: await getDataForChart(
      access_token,
      'opportunitiesTableId',
      charts,
    ),
  };
}

async function getDataForChart(
  token: string,
  chartName: string,
  charts: any[],
): Promise<number | undefined> {
  const chart = findChartByName(charts, chartName);
  if (!chart) {
    logger.error(
      `Cannot get data for chart with name ${chartName} as it was not found in list of charts.`,
      { chartName },
    );
    return undefined;
  }

  const chartData = await getChartData(token, chart.id);
  if (!chartData) {
    throw new Error(
      `Failed to get chart with chart name ${chartName} and id ${chart.id}`,
    );
  }

  if (!chartData.length) {
    throw new Error(
      `Failed to get data for chart with chart name ${chartName} and id ${chart.id}`,
    );
  }

  const data = chartData[0].data;

  if (!data || !data.length) {
    throw new Error(
      `Failed to get data for chart with chart name ${chartName} and id ${chart.id}, chart has no metrics`,
    );
  }

  const chartMetric = data[0];
  const chartMetricValue = Object.values(chartMetric)[0];

  return chartMetricValue as number;
}

function findChartByName(charts: any[], name: string) {
  return charts.find((chart) => chart?.slice_name === name);
}
