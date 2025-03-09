const systemMock = {
  get: jest.fn(),
};

jest.mock('@openops/server-shared', () => ({
  system: systemMock,
}));

const makeHttpRequestMock = jest.fn();
jest.mock('@openops/common', () => {
  return {
    makeHttpRequest: makeHttpRequestMock,
  };
});

import { AxiosHeaders } from 'axios';
import { AnodotUser, getAnodotUsers } from '../../src/lib/common/users';

describe('Request Anodot Users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return users on successful request', async () => {
    const tokens = {
      Authorization: 'authorization token',
      apikey: 'api key',
    };

    const mockUser = {
      id: 11286,
      user_key: '3e8b12c3-c9ec-4d94-8072-5f040e06e39c',
      user_name: 'funatavo@gotgel.org',
      user_display_name: 'funatavo@gotgel.org',
      user_type: '2',
    };
    makeHttpRequestMock.mockResolvedValue(mockUser);

    const result: AnodotUser = await getAnodotUsers('base-url', tokens);
    expect(result).toStrictEqual(mockUser);
    expect(makeHttpRequestMock).toHaveBeenCalledWith(
      'GET',
      'base-url/v1/users',
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: tokens.Authorization,
        apikey: tokens.apikey,
      }),
    );
  });

  it('should log an error and throw an exception on failed request', async () => {
    const tokens = {
      Authorization: 'authorization token',
      apikey: 'api key',
    };
    const errorMessage = 'Failed';

    makeHttpRequestMock.mockRejectedValue(new Error(errorMessage));

    await expect(getAnodotUsers('base-url', tokens)).rejects.toThrow(
      errorMessage,
    );

    expect(makeHttpRequestMock).toHaveBeenCalledWith(
      'GET',
      'base-url/v1/users',
      new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: tokens.Authorization,
        apikey: tokens.apikey,
      }),
    );
  });
});
