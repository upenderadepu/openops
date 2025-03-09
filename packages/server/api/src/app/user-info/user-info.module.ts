import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { IdentityClient } from '@frontegg/client';
import { AppSystemProp, logger, system } from '@openops/server-shared';
import { ALL_PRINCIPAL_TYPES } from '@openops/shared';
import { getCloudToken, getCloudUser } from './cloud-auth';

export const userInfoModule: FastifyPluginAsyncTypebox = async (app) => {
  await app.register(userInfoController, { prefix: '/v1/user-info' });
};

export const userInfoController: FastifyPluginAsyncTypebox = async (app) => {
  const fronteggClientId = system.get(AppSystemProp.FRONTEGG_CLIENT_ID);
  const fronteggApiKey = system.get(AppSystemProp.FRONTEGG_API_KEY);

  if (!fronteggClientId || !fronteggApiKey) {
    logger.info(
      'Missing Frontegg configuration, disabling cloud templates API',
    );
    return;
  }

  const identityClient = new IdentityClient({
    FRONTEGG_CLIENT_ID: fronteggClientId,
    FRONTEGG_API_KEY: fronteggApiKey,
  });

  // user-info is available on any origin
  app.addHook('onSend', (request, reply, payload, done) => {
    void reply.header(
      'Access-Control-Allow-Origin',
      request.headers.origin || request.headers['Ops-Origin'] || '*',
    );
    void reply.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    void reply.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Ops-Origin,Authorization',
    );
    void reply.header('Access-Control-Allow-Credentials', 'true');
    if (request.method === 'OPTIONS') {
      return reply.status(204).send();
    }

    done(null, payload);
    return;
  });

  app.get(
    '/',
    {
      config: {
        allowedPrincipals: ALL_PRINCIPAL_TYPES,
        skipAuth: true,
      },
    },
    async (request, reply) => {
      const token = getCloudToken(request);
      const user = await getCloudUser(identityClient, token);

      if (!user) {
        return reply.status(401).send();
      }

      return user;
    },
  );
};
