import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { PrincipalType } from '@openops/shared';
import { StatusCodes } from 'http-status-codes';
import { fileService } from './file.service';

export const fileController: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/:fileId', GetFileRequest, async (request, reply) => {
    const { fileId } = request.params;
    const file = await fileService.getOneOrThrow({
      projectId: request.principal.projectId,
      fileId,
    });
    return reply.type('application/zip').status(StatusCodes.OK).send(file.data);
  });
};

const GetFileRequest = {
  config: {
    allowedPrincipals: [PrincipalType.USER],
  },
  schema: {
    params: Type.Object({
      fileId: Type.String(),
    }),
  },
};
