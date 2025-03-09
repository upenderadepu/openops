import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  logger,
  runWithLogContext,
  setStopHandlers,
  telemetry,
} from '@openops/server-shared';
import { EngineResponseStatus } from '@openops/shared';
import { Mutex } from 'async-mutex';
import fastify from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { executeEngine } from './engine-executor';
import { getEnvironmentId } from './get-environment-id';
import { EngineRequest } from './main';

const app = fastify({
  bodyLimit: 6 * 1024 * 1024, // 6MB same as engine api-handler & nginx.conf
});
const telemetryMutex = new Mutex();
let telemetryAlreadyStarted = false;

const engineController: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/execute',
    {
      schema: {
        body: EngineRequest,
      },
    },
    async (request, reply) => {
      await runWithLogContext(
        {
          requestId: request.headers?.['requestid'] ?? request.id,
          operationType: request.body.operationType,
        },
        () => handleRequest(request, reply),
      );
    },
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleRequest(request: any, reply: any): Promise<void> {
  try {
    const { engineInput, operationType } = request.body as EngineRequest;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const engineToken = (engineInput as any).engineToken;
    await startTelemetry(engineToken);

    logger.info(`Received request for operation [${operationType}]`, {
      operationType,
    });

    const result = await executeEngine(engineInput, operationType);

    await reply.status(StatusCodes.OK).send(result);
  } catch (error) {
    logger.error('Engine execution failed.', { error });

    await reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
      JSON.stringify({
        status: EngineResponseStatus.ERROR,
        message: 'Engine execution failed.',
      }),
    );
  }
}

async function startTelemetry(engineToken: string): Promise<void> {
  await telemetryMutex.runExclusive(async () => {
    if (telemetryAlreadyStarted) {
      logger.debug('Telemetry has already started.');
      return;
    }

    await telemetry.start(async () => getEnvironmentId(engineToken));
    logger.debug('Telemetry started.');
    telemetryAlreadyStarted = true;
  });
}

export const start = async (): Promise<void> => {
  try {
    logger.info('Starting Engine API...');

    setStopHandlers(app);

    await app.register(engineController);

    await app.listen({
      host: '0.0.0.0',
      port: 3005,
    });

    logger.info('Engine listening on 3005.');
  } catch (err) {
    logger.error('Something wrong with the engine API.', { err });

    throw err;
  }
};
