import { distributedLock, Lock, logger } from '@openops/server-shared';
import {
  ApplicationError,
  ErrorCode,
  FlowId,
  FlowVersionId,
  isNil,
  openOpsId,
  ProjectId,
  WebhookSimulation,
} from '@openops/shared';
import { repoFactory } from '../../core/db/repo-factory';
import { WebhookSimulationEntity } from './webhook-simulation-entity';
import { webhookSideEffects } from './webhook-simulation-side-effects';

type BaseParams = {
  flowId: FlowId;
  flowVersionId?: FlowVersionId;
  projectId: ProjectId;
};

type DeleteParams = BaseParams & {
  parentLock?: Lock;
};

type GetParams = BaseParams;
type CreateParams = BaseParams;

type AcquireLockParams = {
  flowId: FlowId;
};

const createLock = async ({ flowId }: AcquireLockParams): Promise<Lock> => {
  const key = `${flowId}-webhook-simulation`;
  return distributedLock.acquireLock({ key, timeout: 5000 });
};

const webhookSimulationRepo = repoFactory(WebhookSimulationEntity);

export const webhookSimulationService = {
  async create(params: CreateParams): Promise<WebhookSimulation> {
    logger.debug(params, '[WebhookSimulationService#deleteByFlowId] params');

    const { flowId, flowVersionId, projectId } = params;

    const lock = await createLock({
      flowId,
    });

    try {
      const webhookSimulationExists = await webhookSimulationRepo().exists({
        where: { flowId },
      });

      if (webhookSimulationExists) {
        await this.delete({
          flowId,
          flowVersionId,
          projectId,
          parentLock: lock,
        });
      }

      const webhookSimulation: Omit<WebhookSimulation, 'created' | 'updated'> =
        {
          id: openOpsId(),
          ...params,
        };

      await webhookSideEffects.preCreate({
        flowId,
        projectId,
      });

      return await webhookSimulationRepo().save(webhookSimulation);
    } finally {
      await lock.release();
    }
  },
  async get(params: GetParams): Promise<WebhookSimulation | null> {
    logger.debug(params, '[WebhookSimulationService#getByFlowId] params');

    const { flowId, projectId } = params;

    return webhookSimulationRepo().findOneBy({
      flowId,
      projectId,
    });
  },
  async getOrThrow(params: GetParams): Promise<WebhookSimulation> {
    const webhookSimulation = await this.get(params);
    const { flowId, projectId } = params;

    if (isNil(webhookSimulation)) {
      logger.debug('[WebhookSimulationService#getByFlowId] not found');
      throw new ApplicationError({
        code: ErrorCode.ENTITY_NOT_FOUND,
        params: {
          message: `entityType=webhookSimulation flowId=${flowId} projectId=${projectId}`,
        },
      });
    }
    return webhookSimulation;
  },

  async delete(params: DeleteParams): Promise<void> {
    logger.debug(params, '[WebhookSimulationService#deleteByFlowId] params');

    const { flowId, flowVersionId, projectId, parentLock } = params;

    let lock: Lock | null = null;

    if (isNil(parentLock)) {
      lock = await createLock({
        flowId,
      });
    }

    try {
      const webhookSimulation = await this.get({
        flowId,
        projectId,
      });
      if (isNil(webhookSimulation)) {
        return;
      }
      await webhookSideEffects.preDelete({
        flowId,
        projectId,
        flowVersionId,
      });

      await webhookSimulationRepo().remove(webhookSimulation);
    } finally {
      if (lock) {
        await lock.release();
      }
    }
  },
};
