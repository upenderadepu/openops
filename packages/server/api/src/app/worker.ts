import { logger, system, WorkerSystemProps } from '@openops/server-shared';
import { isNil, WorkerMachineType } from '@openops/shared';
import { FastifyInstance } from 'fastify';
import { flowWorker } from 'server-worker';
import { accessTokenManager } from './authentication/lib/access-token-manager';
import { blocksBuilder } from './blocks/block-metadata-service/blocks-builder';

export const setupWorker = async (app: FastifyInstance): Promise<void> => {
  const workerToken = await generateWorkerToken();
  await flowWorker.init(workerToken);
  app.addHook('onClose', async () => {
    logger.info('Worker shutting down');
    await flowWorker.close();
  });
  blocksBuilder(app.io).catch((error) => {
    logger.error('Failed to build blocks, shutting down', error);
    process.exit(1);
  });
};
export async function workerPostBoot(): Promise<void> {
  logger.info('Worker started');
  await flowWorker.start();
}

async function generateWorkerToken(): Promise<string> {
  const workerToken = system.get(WorkerSystemProps.WORKER_TOKEN);
  if (!isNil(workerToken)) {
    return workerToken;
  }
  return accessTokenManager.generateWorkerToken({
    type: WorkerMachineType.SHARED,
    organizationId: null,
  });
}
