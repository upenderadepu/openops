import { Finding } from '@aws-sdk/client-compute-optimizer';
import { groupARNsByRegion } from '@openops/common';
import { Ec2RecommendationsBuilder } from './ec2-recommendations-builder';
import { ComputeOptimizerRecommendation } from './get-recommendations';

export async function getEC2RecommendationsForRegions(
  credentials: any,
  findingType: Finding,
  regions: string[],
): Promise<ComputeOptimizerRecommendation[]> {
  const result: ComputeOptimizerRecommendation[] = [];

  const recommendationType = getRecommendationType(findingType);
  const recommendationsBuilder = new Ec2RecommendationsBuilder(
    credentials,
    findingType,
    recommendationType,
  );

  for (const region of regions) {
    const recommendations = await recommendationsBuilder.getRecommendations(
      credentials,
      region,
    );

    result.push(...recommendations);
  }

  return result;
}

export async function getEC2RecommendationsForARNs(
  credentials: any,
  findingType: Finding,
  arns: string[],
): Promise<ComputeOptimizerRecommendation[]> {
  const result: ComputeOptimizerRecommendation[] = [];

  const arnsPerRegion = groupARNsByRegion(arns);

  const recommendationType = getRecommendationType(findingType);
  const recommendationsBuilder = new Ec2RecommendationsBuilder(
    credentials,
    findingType,
    recommendationType,
  );

  for (const region in arnsPerRegion) {
    const recommendations = await recommendationsBuilder.getRecommendations(
      credentials,
      region,
      arnsPerRegion[region],
    );

    result.push(...recommendations);
  }

  return result;
}

function getRecommendationType(findingType: Finding): string {
  if (findingType === Finding.OPTIMIZED) {
    return 'UpgradeEc2InstanceGeneration';
  }

  // All others AWS findings are related to instances rightsizing
  return 'RightSizeEc2Instance';
}
