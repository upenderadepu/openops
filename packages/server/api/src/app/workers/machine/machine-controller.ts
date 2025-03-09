import {
  FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { system } from '@openops/server-shared';
import {
  OpsEdition,
  PrincipalType,
  WorkerMachineHealthcheckRequest,
  WorkerMachineType,
  WorkerPrincipal,
} from '@openops/shared';
import { accessTokenManager } from '../../authentication/lib/access-token-manager';
import { organizationService } from '../../organization/organization.service';
import { machineService } from './machine-service';

export const workerMachineController: FastifyPluginAsyncTypebox = async (
  app,
) => {
  app.get('/', ListWorkersParams, async (req, reply) => {
    // TODO replace with specific organization id in future
    if ([OpsEdition.CLOUD].includes(system.getEdition())) {
      return [];
    }
    return machineService.list();
  });

  app.post('/', GenerateWorkerTokenParams, async (request) => {
    const organization = await organizationService.getOneOrThrow(
      request.body.organizationId,
    );
    return accessTokenManager.generateWorkerToken({
      organizationId: organization.id,
      type: WorkerMachineType.DEDICATED,
    });
  });

  app.post('/heartbeat', HeartbeatParams, async (request) => {
    const {
      cpuUsagePercentage,
      ramUsagePercentage,
      totalAvailableRamInBytes,
      ip,
    } = request.body;
    const workerPrincipal = request.principal as unknown as WorkerPrincipal;
    await machineService.upsert({
      cpuUsagePercentage,
      ramUsagePercentage,
      totalAvailableRamInBytes,
      ip,
      workerPrincipal,
    });
  });
};

const GenerateWorkerTokenParams = {
  config: {
    // TODO this should be replaced with the user
    allowedPrincipals: [PrincipalType.SUPER_USER],
  },
  schema: {
    body: Type.Object({
      organizationId: Type.String(),
    }),
  },
};

const HeartbeatParams = {
  config: {
    allowedPrincipals: [PrincipalType.WORKER],
  },
  schema: {
    body: WorkerMachineHealthcheckRequest,
  },
};

const ListWorkersParams = {
  config: {
    allowedPrincipals: [PrincipalType.USER],
  },
};
