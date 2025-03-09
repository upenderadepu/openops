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
import {
  AnodotTokens,
  authenticateUserWithAnodot,
} from '../../src/lib/common/auth';

describe('Authenticate Anodot User', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return tokens on successful authentication', async () => {
    const username = 'test@example.com';
    const password = 'password123';
    const authorization = 'authorization token';
    const apikey = 'api key';

    makeHttpRequestMock.mockResolvedValue({
      Authorization: authorization,
      apikey: apikey,
    });

    const result: AnodotTokens = await authenticateUserWithAnodot(
      'base-url',
      username,
      password,
    );
    expect(result).toEqual({ Authorization: authorization, apikey });
    expect(makeHttpRequestMock).toHaveBeenCalledWith(
      'POST',
      'base-url/credentials',
      new AxiosHeaders({ 'Content-Type': 'application/json' }),
      { username, password },
    );
  });

  it('should log an error and throw an exception on failed authentication', async () => {
    const username = 'test@example.com';
    const password = 'password123';
    const errorMessage = 'Authentication failed';

    makeHttpRequestMock.mockRejectedValue(new Error(errorMessage));

    await expect(
      authenticateUserWithAnodot('base-url', username, password),
    ).rejects.toThrow(errorMessage);

    expect(makeHttpRequestMock).toHaveBeenCalledWith(
      'POST',
      'base-url/credentials',
      new AxiosHeaders({ 'Content-Type': 'application/json' }),
      { username, password },
    );
  });
});
