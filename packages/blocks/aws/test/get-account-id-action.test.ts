const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  getAccountId: jest.fn(),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { getAccountIdAction } from '../src/lib/actions/get-account-id-action';

describe('getAccountIdAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    openopsCommonMock.getCredentialsForAccount.mockResolvedValue('credentials');
  });

  test('should return role informations if auth has roles', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: [
          {
            assumeRoleArn: 'arn:aws:iam::1:service/resource1',
            accountName: 'name1',
          },
          {
            assumeRoleArn: 'arn:aws:iam::2:service/resource2',
            accountName: 'name2',
          },
          {
            assumeRoleArn: 'arn:aws:iam::3:service/resource3',
            accountName: 'name3',
          },
        ],
      },
      propsValue: {
        accounts: { accounts: ['1', '2', '3'] },
      },
    };

    const result = (await getAccountIdAction.run(context)) as any;

    expect(result).toEqual([
      { accountId: '1', accountName: 'name1' },
      { accountId: '2', accountName: 'name2' },
      { accountId: '3', accountName: 'name3' },
    ]);
    expect(openopsCommonMock.getCredentialsForAccount).not.toHaveBeenCalled();
    expect(openopsCommonMock.getAccountId).not.toHaveBeenCalled();
  });

  test('should only go over selected accounts', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: [
          {
            assumeRoleArn: 'arn:aws:iam::1:service/resource1',
            accountName: 'name1',
          },
          {
            assumeRoleArn: 'arn:aws:iam::2:service/resource2',
            accountName: 'name2',
          },
          {
            assumeRoleArn: 'arn:aws:iam::3:service/resource3',
            accountName: 'name3',
          },
        ],
      },
      propsValue: {
        accounts: { accounts: ['1', '3'] },
      },
    };

    const result = (await getAccountIdAction.run(context)) as any;

    expect(result).toEqual([
      { accountId: '1', accountName: 'name1' },
      { accountId: '3', accountName: 'name3' },
    ]);
    expect(openopsCommonMock.getCredentialsForAccount).not.toHaveBeenCalled();
    expect(openopsCommonMock.getAccountId).not.toHaveBeenCalled();
  });

  test('should use getAccountId if no roles are defined', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: undefined,
      },
      propsValue: {
        accounts: {},
      },
    };

    openopsCommonMock.getAccountId.mockResolvedValue('mockResult');

    const result = (await getAccountIdAction.run(context)) as any;

    expect(result).toEqual([{ accountId: 'mockResult' }]);
    expect(openopsCommonMock.getAccountId).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getAccountId).toHaveBeenCalledWith(
      'credentials',
      'some region',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
    );
  });
});
