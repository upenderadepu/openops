import { createBlock } from '@openops/blocks-framework';
import { BlockCategory } from '@openops/shared';
import { getBudgets } from './lib/actions/get-budgets';
import { getDataIntegrations } from './lib/actions/get-data-integrations';
import { ternaryCloudAuth } from './lib/common/auth';

export const ternary = createBlock({
  displayName: 'Ternary',
  description: 'FinOps multi-cloud analytics platform.',
  auth: ternaryCloudAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://static.openops.com/blocks/ternary.png',
  categories: [BlockCategory.FINOPS],
  authors: ['Quilyx'],
  actions: [
    getDataIntegrations,
    getBudgets,
    // forecasting
    // cost allocation?
    //getUsageRecommendations,
    //updateUsageRecommendations,
  ],
  triggers: [],
});
