import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { cloudTemplateController } from './cloud-template.controller';
import { flowTemplateController } from './flow-template.controller';

export const flowTemplateModule: FastifyPluginAsyncTypebox = async (app) => {
  await app.register(flowTemplateController, { prefix: '/v1/flow-templates' });

  // todo - this controller should only be loaded in cloud environment
  await app.register(cloudTemplateController, {
    prefix: '/v1/cloud-templates',
  });
};
