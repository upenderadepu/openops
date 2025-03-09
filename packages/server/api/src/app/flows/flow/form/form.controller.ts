import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import {
  ALL_PRINCIPAL_TYPES,
  OpenOpsId,
  USE_DRAFT_QUERY_PARAM_NAME,
} from '@openops/shared';
import { formService } from './form.service';

export const formController: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/:flowId', GetFormRequest, async (request) => {
    return formService.getFormByFlowIdOrThrow(
      request.params.flowId,
      request.query.useDraft ?? false,
    );
  });
};

const GetFormRequest = {
  config: {
    allowedPrincipals: ALL_PRINCIPAL_TYPES,
  },
  schema: {
    description: 'Get a form by flow id',
    params: Type.Object({
      flowId: OpenOpsId,
    }),
    querystring: Type.Object({
      [USE_DRAFT_QUERY_PARAM_NAME]: Type.Optional(Type.Boolean()),
    }),
  },
};
