const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  getAccountInformation: jest.fn(),
  getAccountId: jest.fn(),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { getAccountInfoAction } from '../src/lib/actions/get-account-info-action';

describe('getAccountInfoAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    openopsCommonMock.getCredentialsForAccount.mockResolvedValue('credentials');
  });

  test('should return information for all roles', async () => {
    openopsCommonMock.getAccountInformation
      .mockResolvedValueOnce('mockResult1')
      .mockResolvedValueOnce('mockResult2')
      .mockResolvedValueOnce('mockResult3');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: [
          { assumeRoleArn: 'arn:aws:iam::1:service/resource1' },
          { assumeRoleArn: 'arn:aws:iam::2:service/resource2' },
          { assumeRoleArn: 'arn:aws:iam::3:service/resource3' },
        ],
      },
      propsValue: {
        accounts: { accounts: ['1', '2', '3'] },
      },
    };

    const result = (await getAccountInfoAction.run(context)) as any;

    expect(result).toEqual(['mockResult1', 'mockResult2', 'mockResult3']);
    expect(openopsCommonMock.getAccountId).not.toHaveBeenCalled();
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(3);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenNthCalledWith(
      1,
      context.auth,
      '1',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenNthCalledWith(
      2,
      context.auth,
      '2',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenNthCalledWith(
      3,
      context.auth,
      '3',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenCalledTimes(3);
    expect(openopsCommonMock.getAccountInformation).toHaveBeenNthCalledWith(
      1,
      'credentials',
      'some region',
      '1',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenNthCalledWith(
      2,
      'credentials',
      'some region',
      '2',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenNthCalledWith(
      3,
      'credentials',
      'some region',
      '3',
    );
  });

  test('should only go over selected accounts', async () => {
    openopsCommonMock.getAccountInformation
      .mockResolvedValueOnce('mockResult1')
      .mockResolvedValueOnce('mockResult3');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: [
          { assumeRoleArn: 'arn:aws:iam::1:service/resource1' },
          { assumeRoleArn: 'arn:aws:iam::2:service/resource2' },
          { assumeRoleArn: 'arn:aws:iam::3:service/resource3' },
        ],
      },
      propsValue: {
        accounts: { accounts: ['1', '3'] },
      },
    };

    const result = (await getAccountInfoAction.run(context)) as any;

    expect(result).toEqual(['mockResult1', 'mockResult3']);
    expect(openopsCommonMock.getAccountId).not.toHaveBeenCalled();
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(2);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenNthCalledWith(
      1,
      context.auth,
      '1',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenNthCalledWith(
      2,
      context.auth,
      '3',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenCalledTimes(2);
    expect(openopsCommonMock.getAccountInformation).toHaveBeenNthCalledWith(
      1,
      'credentials',
      'some region',
      '1',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenNthCalledWith(
      2,
      'credentials',
      'some region',
      '3',
    );
  });

  test('should get account id for main account if no roles are provided', async () => {
    openopsCommonMock.getAccountInformation.mockResolvedValue('mockResult');
    openopsCommonMock.getAccountId.mockResolvedValue('some account id');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
        roles: [],
      },
      propsValue: {
        accounts: {},
      },
    };

    const result = await getAccountInfoAction.run(context);

    expect(result).toEqual(['mockResult']);
    expect(openopsCommonMock.getAccountId).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getAccountId).toHaveBeenCalledWith(
      'credentials',
      'some region',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenCalledWith(
      'credentials',
      'some region',
      'some account id',
    );
    expect(openopsCommonMock.getAccountInformation).toHaveBeenCalledTimes(1);
  });
});
