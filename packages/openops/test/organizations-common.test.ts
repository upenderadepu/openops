const mockSend = jest.fn();

const mockCreateClient = jest.fn();

const mockDescribeAccountCommand = jest.fn().mockImplementation(() => {
  return {};
});

jest.mock('@aws-sdk/client-organizations', () => {
  return {
    OrganizationsClient: mockCreateClient.mockImplementation(() => {
      return {
        send: mockSend,
      };
    }),
    DescribeAccountCommand: mockDescribeAccountCommand,
  };
});

import {
  getAccountInformation,
  getAccountName,
} from '../src/lib/aws/organizations-common';

describe('Account tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const credentials = {
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret access key',
    sessionToken: 'some session token',
    endpoint: 'some endpoint',
  };

  describe('getAccountInformation tests', () => {
    test('should return account information', async () => {
      mockSend.mockResolvedValue({
        Credentials: 'some credentials',
        Account: {
          Name: 'some account name',
          Arn: 'some arn',
        },
      });

      const result = await getAccountInformation(
        credentials,
        'some region',
        'some accountId',
      );

      expect(result).toStrictEqual({
        Name: 'some account name',
        Arn: 'some arn',
      });

      expect(mockCreateClient).toHaveBeenCalledWith({
        region: 'some region',
        credentials: {
          accessKeyId: 'some access key',
          secretAccessKey: 'some secret access key',
          sessionToken: 'some session token',
        },
        endpoint: 'some endpoint',
      });

      expect(mockDescribeAccountCommand).toHaveBeenCalledWith({
        AccountId: 'some accountId',
      });
      expect(mockSend).toHaveBeenCalledWith({});
    });

    test('should throw if error occurs in send command', async () => {
      mockSend.mockRejectedValue(new Error('some error'));

      await expect(
        getAccountInformation(credentials, 'some region', 'some accountId'),
      ).rejects.toThrow('some error');
    });
  });

  describe('getAccountName tests', () => {
    test('should return account name', async () => {
      mockSend.mockResolvedValue({
        Credentials: 'some credentials',
        Account: {
          Name: 'some account name',
        },
      });

      const result = await getAccountName(
        credentials,
        'some region',
        'some accountId',
      );

      expect(result).toBe('some account name');

      expect(mockCreateClient).toHaveBeenCalledWith({
        region: 'some region',
        credentials: {
          accessKeyId: 'some access key',
          secretAccessKey: 'some secret access key',
          sessionToken: 'some session token',
        },
        endpoint: 'some endpoint',
      });

      expect(mockDescribeAccountCommand).toHaveBeenCalledWith({
        AccountId: 'some accountId',
      });
      expect(mockSend).toHaveBeenCalledWith({});
    });

    test('should return undefined if error occurs in send command', async () => {
      mockSend.mockRejectedValue(new Error('some error'));

      const result = await getAccountName(
        credentials,
        'some region',
        'some accountId',
      );

      expect(result).toBe(undefined);
    });
  });
});
