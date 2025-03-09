import { PrincipalType } from '@openops/shared';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { databaseConnection } from '../../../../src/app/database/database-connection';
import { setupServer } from '../../../../src/app/server';
import { generateMockToken } from '../../../helpers/auth';
import {
  createMockOrganization,
  createMockProject,
  createMockUser,
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

describe('Project Worker API', () => {
  describe('Get worker project endpoint', () => {
    it('Returns worker project', async () => {
      // arrange
      const mockUser = createMockUser();
      await databaseConnection().getRepository('user').save([mockUser]);

      const mockOrganization = createMockOrganization({
        ownerId: mockUser.id,
      });
      await databaseConnection()
        .getRepository('organization')
        .save([mockOrganization]);

      const mockProject = createMockProject({
        ownerId: mockUser.id,
        organizationId: mockOrganization.id,
      });
      await databaseConnection().getRepository('project').save([mockProject]);

      const mockToken = await generateMockToken({
        type: PrincipalType.ENGINE,
        projectId: mockProject.id,
      });

      // act
      const response = await app?.inject({
        method: 'GET',
        url: '/v1/worker/project',
        headers: {
          authorization: `Bearer ${mockToken}`,
        },
      });

      // assert
      expect(response?.statusCode).toBe(StatusCodes.OK);
      const responseBody = response?.json();
      expect(responseBody?.id).toBe(mockProject.id);
    });
  });
});
