import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { SharedSystemProp, system } from '@openops/server-shared';
import { ALL_PRINCIPAL_TYPES } from '@openops/shared';

export const metaModule: FastifyPluginAsyncTypebox = async (app) => {
  await app.register(metaController, { prefix: '/v1/meta' });
};

const metaController: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    '/',
    {
      config: {
        allowedPrincipals: ALL_PRINCIPAL_TYPES,
      },
    },
    async () => {
      return {
        version: system.get(SharedSystemProp.VERSION),
        tablesVersion: system.get(SharedSystemProp.OPENOPS_TABLES_VERSION),
        analyticsVersion: system.get(SharedSystemProp.ANALYTICS_VERSION),
        environment: system.get(SharedSystemProp.ENVIRONMENT_NAME),
      };
    },
  );
};
