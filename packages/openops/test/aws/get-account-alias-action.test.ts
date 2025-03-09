const getRoleForAccountMock = jest.fn();
jest.mock('../../src/lib/aws/auth', () => ({
  getRoleForAccount: getRoleForAccountMock,
}));

import { getAccountAlias } from '../../src/lib/aws/get-account-alias-action';

describe('getAccountAlias', () => {
  test('should create action with correct propeties', () => {
    expect(getAccountAlias().props).toMatchObject({
      accountId: {
        required: true,
        type: 'SHORT_TEXT',
        displayName: 'Account ID',
      },
    });
  });

  test('should call getRoleForAccount', async () => {
    getRoleForAccountMock.mockReturnValue({ accountName: 'name1' });
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: {
        accessKeyId: 'some accessKeyId',
        secretAccessKey: 'some secretAccessKey',
        defaultRegion: 'some region',
      },
      propsValue: {
        accountId: '1',
      },
    };

    const result = (await getAccountAlias().run(context)) as any;

    expect(result).toEqual('name1');
    expect(getRoleForAccountMock).toHaveBeenCalledTimes(1);
    expect(getRoleForAccountMock).toHaveBeenCalledWith(context.auth, '1');
  });
});
