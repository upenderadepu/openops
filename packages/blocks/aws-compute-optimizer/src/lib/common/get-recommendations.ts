import { getComputeOptimizerClient } from './compute-optimizer-client';
import { RecommendationsBuilder } from './recommendations-builder';

export interface ComputeOptimizerRecommendation {
  arn: string;
  recommendation: any;
}

export async function getRecommendations<TFinding, TResult>(
  recommendationBuilder: RecommendationsBuilder<TFinding, TResult>,
  credentials: any,
  region: string,
  arns?: string[],
): Promise<ComputeOptimizerRecommendation[]> {
  const client = getComputeOptimizerClient(credentials, region);

  const commonInput = {
    filters: [{ name: 'Finding', values: [recommendationBuilder.findingType] }],
  };

  const recommendations: TResult[] = [];
  const { result } = await recommendationBuilder.makeRequest(
    client,
    commonInput,
    arns,
  );

  if (result) {
    recommendations.push(...result);
  }

  return await mapRecommendations(recommendationBuilder, recommendations);
}

async function mapRecommendations<TFinding, TResult>(
  recommendationBuilder: RecommendationsBuilder<TFinding, TResult>,
  recommendations: TResult[],
): Promise<ComputeOptimizerRecommendation[]> {
  const result: ComputeOptimizerRecommendation[] = [];

  for (const resourceRecommendation of recommendations) {
    try {
      const recommendation = recommendationBuilder.createRecommendation(
        resourceRecommendation,
      );
      if (recommendation.options.length == 0) {
        // The recommendation does not have any saving option.
        continue;
      }

      result.push({
        arn: recommendationBuilder.getResourceArn(resourceRecommendation),
        recommendation,
      });
    } catch (error) {
      throw new Error(
        `An unknown error occurred while mapping a recommendation.\n${error}`,
      );
    }
  }

  return result;
}
