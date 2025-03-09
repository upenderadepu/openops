import {
  ComputeOptimizerClient,
  GetRecommendationSummariesCommand,
  RecommendationSummary,
} from '@aws-sdk/client-compute-optimizer';
import { getAwsClient, makeAwsRequest } from '@openops/common';

export async function getRecommendationSummaries(
  credentials: any,
  regions: string[],
): Promise<RecommendationSummary[]> {
  const results: RecommendationSummary[] = [];

  for (const region of regions) {
    const client = getComputeOptimizerClient(credentials, region);
    const command = new GetRecommendationSummariesCommand({
      nextToken: '',
    });
    const regionalResults = await makeAwsRequest(client, command);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const result of regionalResults as any) {
      const recommendationSummaries = result.recommendationSummaries?.map(
        (item: any) => ({ ...item, region }),
      );

      if (recommendationSummaries) {
        results.push(...recommendationSummaries);
      }
    }
  }

  return results;
}

export function getComputeOptimizerClient(
  credentials: any,
  region: string,
): ComputeOptimizerClient {
  return getAwsClient(ComputeOptimizerClient, credentials, region);
}
