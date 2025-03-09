import { openOpsId, PrincipalType } from '@openops/shared';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { databaseConnection } from '../../../../src/app/database/database-connection';
import { setupServer } from '../../../../src/app/server';
import { generateMockToken } from '../../../helpers/auth';
import {
  createMockFlow,
  createMockFlowVersion,
  createMockProject,
  mockBasicSetup,
} from '../../../helpers/mocks';

let app: FastifyInstance | null = null;

beforeAll(async () => {
  await databaseConnection().initialize();
  app = await setupServer();
});

afterAll(async () => {
  await databaseConnection().destroy();
  await app?.close();
});

describe('Flow API for Worker', () => {
  describe('Get Flow from Worker', () => {
    it('List other flow for another project', async () => {
      // arrange
      const { mockOrganization, mockOwner, mockProject } =
        await mockBasicSetup();

      const mockProject2 = createMockProject({
        organizationId: mockOrganization.id,
        ownerId: mockOwner.id,
      });

      await databaseConnection().getRepository('project').save([mockProject2]);

      const mockFlow = createMockFlow({
        projectId: mockProject.id,
      });
      await databaseConnection().getRepository('flow').save([mockFlow]);

      const mockFlowVersion = createMockFlowVersion({
        flowId: mockFlow.id,
      });
      await databaseConnection()
        .getRepository('flow_version')
        .save([mockFlowVersion]);

      const mockToken = await generateMockToken({
        id: openOpsId(),
        type: PrincipalType.WORKER,
        projectId: mockProject2.id,
      });

      const response = await app?.inject({
        method: 'GET',
        url: `/v1/worker/flows/${mockFlowVersion.id}`,
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      });
      expect(response?.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
