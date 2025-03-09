import { IdentityClient } from '@frontegg/client';
import { IEntityWithRoles } from '@frontegg/client/dist/src/clients/identity/types';
import { FastifyRequest } from 'fastify';
import {
  getCloudToken,
  getCloudUser,
} from '../../../../src/app/user-info/cloud-auth';

type MockFastifyRequest = FastifyRequest & {
  cookies: Record<string, string>;
};

function createMockRequest(options: {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
}): MockFastifyRequest {
  return {
    headers: options.headers || {},
    cookies: options.cookies || {},
    id: 'test-id',
    params: {},
    raw: {},
    query: {},
    body: null,
    server: {},
    log: {},
    url: '',
    method: 'GET',
    routerPath: '',
    routerMethod: 'GET',
    is404: false,
    routeOptions: {},
    context: {},
    socket: {},
    protocol: 'http',
    ip: '',
    ips: [],
    hostname: '',
    type: '',
    routeConfig: {},
  } as unknown as MockFastifyRequest;
}

describe('cloud-auth', () => {
  describe('getCloudToken', () => {
    it('should extract token from Authorization header', () => {
      const mockRequest = createMockRequest({
        headers: { authorization: 'Bearer test-token' },
        cookies: {},
      });

      expect(getCloudToken(mockRequest)).toBe('test-token');
    });

    it('should get token from cookie when Authorization header is missing', () => {
      const mockRequest = createMockRequest({
        headers: {},
        cookies: { 'cloud-token': 'cookie-token' },
      });

      expect(getCloudToken(mockRequest)).toBe('cookie-token');
    });

    it('should return undefined when no token is present', () => {
      const mockRequest = createMockRequest({
        headers: {},
        cookies: {},
      });

      expect(getCloudToken(mockRequest)).toBeUndefined();
    });
  });

  describe('getCloudUser', () => {
    let mockIdentityClient: jest.Mocked<IdentityClient>;

    beforeEach(() => {
      mockIdentityClient = {
        validateIdentityOnToken: jest.fn(),
      } as never;
    });

    it('should return null when no token is provided', async () => {
      const result = await getCloudUser(mockIdentityClient);
      expect(result).toBeNull();
    });

    it('should return user when validation succeeds', async () => {
      const mockUser = { id: '123', roles: [] };
      mockIdentityClient.validateIdentityOnToken.mockResolvedValue(
        mockUser as unknown as IEntityWithRoles,
      );

      const result = await getCloudUser(mockIdentityClient, 'valid-token');

      expect(result).toEqual(mockUser);
      expect(mockIdentityClient.validateIdentityOnToken).toHaveBeenCalledWith(
        'valid-token',
      );
    });

    it('should return null when validation fails', async () => {
      mockIdentityClient.validateIdentityOnToken.mockRejectedValue(
        new Error('Invalid token'),
      );

      const result = await getCloudUser(mockIdentityClient, 'invalid-token');

      expect(result).toBeNull();
      expect(mockIdentityClient.validateIdentityOnToken).toHaveBeenCalledWith(
        'invalid-token',
      );
    });
  });
});
