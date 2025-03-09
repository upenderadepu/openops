const getAnodotUsersMock = jest.fn();

jest.mock('../../src/lib/common/users', () => ({
  getAnodotUsers: getAnodotUsersMock,
}));

import { getAccountApiKey } from '../../src/lib/common/account';
import { AnodotTokens } from '../../src/lib/common/auth';

describe('getAccountApiKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const anodotTokens: AnodotTokens = {
    Authorization: 'a bearer token',
    apikey: 'an account',
  };

  test('should throw if failed to fetch users', async () => {
    getAnodotUsersMock.mockRejectedValue(new Error('some error'));

    await expect(
      getAccountApiKey('123456789', 'some url', anodotTokens),
    ).rejects.toThrow('some error');

    expect(getAnodotUsersMock).toHaveBeenCalledTimes(1);
    expect(getAnodotUsersMock).toHaveBeenCalledWith('some url', anodotTokens);
  });

  test.each([
    [{ accounts: [] }],
    [{}],
    [undefined],
    [{ accounts: [{ accountId: '2' }] }],
  ])('should throw if no account was found', async (getUsersResult: any) => {
    getAnodotUsersMock.mockResolvedValue(getUsersResult);

    await expect(
      getAccountApiKey('123456789', 'some url', anodotTokens),
    ).rejects.toThrow('No account matching account id: 123456789 was found.');

    expect(getAnodotUsersMock).toHaveBeenCalledTimes(1);
    expect(getAnodotUsersMock).toHaveBeenCalledWith('some url', anodotTokens);
  });

  test('should get account from user with account id when account id exists', async () => {
    getAnodotUsersMock.mockResolvedValue({
      accounts: [
        {
          accountKey: 'account key 1',
          divisionId: 'division id 1',
          accountId: '123456789',
        },
        {
          accountKey: 'account key 2',
          divisionId: 'division id 2',
          accountId: '987654321',
        },
      ],
    });

    const result = await getAccountApiKey(
      '987654321',
      'some url',
      anodotTokens,
    );
    expect(result).toBe('an account:account key 2:division id 2');

    expect(getAnodotUsersMock).toHaveBeenCalledTimes(1);
    expect(getAnodotUsersMock).toHaveBeenCalledWith('some url', anodotTokens);
  });
});
