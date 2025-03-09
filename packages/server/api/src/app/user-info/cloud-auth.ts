import { IdentityClient } from '@frontegg/client';
import {
  IAccessToken,
  IEntityWithRoles,
} from '@frontegg/client/dist/src/clients/identity/types';
import { FastifyRequest } from 'fastify';

const CLOUD_TOKEN_COOKIE_NAME = 'cloud-token';

export const getCloudToken = (request: FastifyRequest): string | undefined => {
  let token = request.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    token = request.cookies[CLOUD_TOKEN_COOKIE_NAME];
  }
  return token;
};

export async function getCloudUser(
  identityClient: IdentityClient,
  token?: string,
): Promise<null | IEntityWithRoles | IAccessToken> {
  if (!token) {
    return null;
  }

  try {
    const user = await identityClient.validateIdentityOnToken(token);
    return user;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
}
