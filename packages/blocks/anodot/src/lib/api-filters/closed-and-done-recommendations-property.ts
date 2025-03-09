import { Property } from '@openops/blocks-framework';
import { dateProperty, operatorProperty } from './property-helpers';

export function closedAndDoneRecommendationsProperty() {
  return Property.DynamicProperties({
    displayName: 'Date filters for closed and done recommendations',
    description: 'Filter closed and done recommendations by date range.',
    required: true,
    refreshers: ['statusFilter'],
    props: async ({ statusFilter }): Promise<{ [key: string]: any }> => {
      if (!statusFilter) {
        return {};
      }

      const statusFilterValue = statusFilter as unknown as any;
      if (statusFilterValue === 'potential_savings') {
        return {};
      }

      return {
        lastUpdateDateFrom: dateProperty(
          '(Last update date) From',
          'Start date (Format: yyyy-MM-dd)',
          false,
        ),
        lastUpdateDateTo: dateProperty(
          '(Last update date) To',
          'End date (Format: yyyy-MM-dd)',
          false,
        ),

        creationDateFrom: dateProperty(
          '(Creation date) From',
          'Start date (Format: yyyy-MM-dd)',
          false,
        ),
        creationDateTo: dateProperty(
          '(Creation date) To',
          'End date (Format: yyyy-MM-dd)',
          false,
        ),

        operator: operatorProperty('Operator', ''),
      };
    },
  });
}
