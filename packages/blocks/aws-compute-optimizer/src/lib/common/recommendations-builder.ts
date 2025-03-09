import { ComputeOptimizerClient } from '@aws-sdk/client-compute-optimizer';
import { ComputeOptimizerRecommendation } from './get-recommendations';

export interface RecommendationsBuilder<TFinding, TResult> {
  recommendationType: string;
  findingType: TFinding;
  credentials: any;

  makeRequest(
    client: ComputeOptimizerClient,
    filters: { filters: unknown[] },
    arns?: string[],
  ): Promise<{ result?: TResult[] }>;
  getRecommendations(
    credentials: any,
    region: string,
    arns?: string[],
  ): Promise<ComputeOptimizerRecommendation[]>;
  createResourceObj(
    recommendation: TResult,
    region: string,
    accountName?: string,
  ): any;
  createRecommendation(recommendation: TResult): any;
  getResourceArn(resource: TResult): string;
  getAccountId(resource: TResult): string;
}
