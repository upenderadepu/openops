import { faker } from '@faker-js/faker';
import {
  filterOutRecommendationOptionsWithoutSavings,
  sortRecommendationOptionsByRank,
} from '../src/lib/common/filter-recommendations';

describe('Filter out recommendation options without savings', () => {
  test('should only return recommendations that have a value greater than zero', () => {
    const validRecommendations = Array.from(
      Array(faker.number.int({ min: 1, max: 5 })),
    ).map(() => {
      return {
        savingsOpportunity: {
          estimatedMonthlySavings: {
            value: faker.number.int({ min: 1, max: 5 }),
            currency: 'USD',
          },
        },
      };
    });

    const emptySavingsRecommendations = Array.from(
      Array(faker.number.int({ min: 1, max: 5 })),
    ).map(() => {
      return {
        savingsOpportunity: {},
      };
    });

    const zeroSavingsRecommendations = Array.from(
      Array(faker.number.int({ min: 1, max: 5 })),
    ).map(() => {
      return {
        savingsOpportunity: {
          estimatedMonthlySavings: {
            value: 0,
            currency: 'USD',
          },
        },
      };
    });

    const filteredRecommendations =
      filterOutRecommendationOptionsWithoutSavings([
        ...zeroSavingsRecommendations,
        ...validRecommendations,
        ...emptySavingsRecommendations,
      ]);

    const expectedValues = validRecommendations.map(
      (v) => v.savingsOpportunity.estimatedMonthlySavings.value,
    );
    expect(filteredRecommendations.length).toEqual(validRecommendations.length);
    filteredRecommendations.forEach((recommendation) => {
      expect(expectedValues).toContain(
        recommendation.savingsOpportunity.estimatedMonthlySavings.value,
      );
    });
  });
});

describe('Sort recommendation options by rank', () => {
  test('should return recommendations ordered by rank', () => {
    const recommendations = Array.from(
      Array(faker.number.int({ min: 1, max: 10 })),
    ).map(() => {
      return { rank: faker.number.int({ min: 1, max: 100 }) };
    });

    const sortedRecommendations =
      sortRecommendationOptionsByRank(recommendations);

    const isOrderedByRank = sortedRecommendations.every(
      (item, index, array) => {
        return index === array.length - 1 || item.rank <= array[index + 1].rank;
      },
    );

    expect(isOrderedByRank).toBe(true);
  });
});
