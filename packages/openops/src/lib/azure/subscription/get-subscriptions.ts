import { AppSystemProp, system } from '@openops/server-shared';
import { createAxiosHeadersForAzure, makeAzureGet } from '../request-helper';

export async function getAzureSubscriptionsList(access_token: any) {
  const apiVersion = system.getOrThrow(AppSystemProp.AZURE_API_VERSION);
  const subscriptionsResult = await makeAzureGet<{
    value: { subscriptionId: string; displayName: string }[];
  }>(
    `subscriptions?api-version=${apiVersion}`,
    createAxiosHeadersForAzure(access_token),
  );

  return subscriptionsResult.flatMap((res) => res.value);
}
