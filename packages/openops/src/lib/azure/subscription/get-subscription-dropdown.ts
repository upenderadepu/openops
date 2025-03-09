import { Property } from '@openops/blocks-framework';
import { authenticateUserWithAzure } from '../auth';
import { getAzureSubscriptionsList } from './get-subscriptions';

async function getAzureSubscriptionsListDropDownOptions(credentials: any) {
  const tokenResult = await authenticateUserWithAzure(credentials);

  const subscriptions = await getAzureSubscriptionsList(
    tokenResult.access_token,
  );

  const dropdownOptions = {
    disabled: false,
    options: subscriptions.map((obj) => ({
      label: obj.displayName,
      value: obj.subscriptionId,
    })),
  };

  return dropdownOptions;
}

export function getAzureSubscriptionsMultiSelectDropdown() {
  return Property.MultiSelectDropdown({
    displayName: 'Subscriptions',
    description: 'Select one or more subscription from the list',
    refreshers: ['auth'],
    required: true,
    options: async ({ auth }: any) => {
      return await getAzureSubscriptionsListDropDownOptions(auth);
    },
  });
}

export function getAzureSubscriptionsDropdown() {
  return Property.Dropdown({
    displayName: 'Subscriptions',
    description: 'Select a single subscription from the list',
    refreshers: ['auth'],
    required: true,
    options: async ({ auth }: any) => {
      return await getAzureSubscriptionsListDropDownOptions(auth);
    },
  });
}

export async function getAzureSubscriptionsStaticDropdown(auth: any) {
  const subscriptions = await getAzureSubscriptionsListDropDownOptions(auth);
  return Property.StaticDropdown({
    displayName: 'Subscriptions',
    description: 'Select a single subscription from the list',
    required: true,
    options: subscriptions,
  });
}
