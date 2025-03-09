import { SavingsOpportunity } from '@aws-sdk/client-compute-optimizer';

export function filterOutRecommendationOptionsWithoutSavings(
  recommendationOptions: { savingsOpportunity?: SavingsOpportunity }[],
): any[] {
  const optionsThatHaveSavings = [];

  for (const recommendationOption of recommendationOptions) {
    const savingsOpportunity = recommendationOption.savingsOpportunity;

    if ((savingsOpportunity?.estimatedMonthlySavings?.value ?? 0) === 0) {
      // This recommendation does not provide any savings.
      continue;
    }

    optionsThatHaveSavings.push(recommendationOption);
  }

  return optionsThatHaveSavings;
}

export function sortRecommendationOptionsByRank(
  recommendationOptions: { rank: number }[],
): any[] {
  return recommendationOptions.sort((a, b) => {
    return a.rank - b.rank;
  });
}
