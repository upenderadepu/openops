import { cacheWrapper, networkUtls } from '@openops/server-shared';
import { FlagId } from '@openops/shared';
import { UUID } from 'node:crypto';

async function getEnvironmentIdFromApi(engineToken: string): Promise<string> {
  const url = `${networkUtls.getInternalApiUrl()}v1/flags/environment-id`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${engineToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get environmentId from the API.');
  }

  const { environmentId } = await response.json();
  return environmentId;
}

export async function getEnvironmentId(engineToken: string): Promise<UUID> {
  let envId = await cacheWrapper.getKey(FlagId.ENVIRONMENT_ID);

  if (envId) {
    return envId as UUID;
  }

  envId = await getEnvironmentIdFromApi(engineToken);
  await cacheWrapper.setKey(FlagId.ENVIRONMENT_ID, envId);

  return envId as UUID;
}
