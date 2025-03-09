const getPriceMock = jest.fn();

jest.mock('../../../../src/app/aws/pricing-service', () => ({
  getPrice: getPriceMock,
}));

import { openOpsId, PrincipalType } from '@openops/shared';
import { FastifyInstance } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { databaseConnection } from '../../../../src/app/database/database-connection';
import { setupServer } from '../../../../src/app/server';
import { generateMockToken } from '../../../helpers/auth';
import { createMockOrganization, createMockUser } from '../../../helpers/mocks';
let app: FastifyInstance | null = null;

beforeAll(async () => {
  await databaseConnection().initialize();
  app = await setupServer();
});

afterAll(async () => {
  await databaseConnection().destroy();
  await app?.close();
});

describe('Pricing API', () => {
  describe('GET', () => {
    test('should return cached value', async () => {
      getPriceMock.mockResolvedValue('some cached value');

      const mockUser = createMockUser();
      await databaseConnection().getRepository('user').save(mockUser);
      const mockOrganization = createMockOrganization({ ownerId: mockUser.id });
      await databaseConnection()
        .getRepository('organization')
        .save(mockOrganization);

      const testToken = await generateMockToken({
        type: PrincipalType.USER,
        id: openOpsId(),
        organization: { id: mockOrganization.id },
      });

      const response = await app?.inject({
        method: 'GET',
        url: '/v1/pricing/?region=us-east-1&serviceCode=AmazonEC2&filters=%5B%7B%22Field%22%3A%22location%22%2C%22Value%22%3A%22US%20East%20%28N.%20Virginia%29%22%7D%5D',
        headers: {
          authorization: `Bearer ${testToken}`,
        },
      });

      expect(response?.statusCode).toBe(StatusCodes.OK);
      expect(response?.body).toEqual('some cached value');
      expect(getPriceMock).toHaveBeenCalledTimes(1);
      expect(getPriceMock).toHaveBeenCalledWith(
        'AmazonEC2',
        [{ Field: 'location', Value: 'US East (N. Virginia)' }],
        'us-east-1',
      );
    });
  });
});
