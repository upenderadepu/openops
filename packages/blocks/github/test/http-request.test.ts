const httpClientMock = {
  sendRequest: jest.fn(),
};

const common = {
  ...jest.requireActual('@openops/blocks-common'),
  httpClient: httpClientMock,
};

jest.mock('@openops/blocks-common', () => common);

import { HttpMethod } from '@openops/blocks-common';
import {
  makePaginatedRequest,
  makeRequest,
} from '../src/lib/common/http-request';

describe('makeRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should make request with given values', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: 'mockBody',
    });

    const result = await makeRequest({
      url: 'someUrl',
      httpMethod: HttpMethod.GET,
      queryParams: { queryParams: 'queryParamsValue' },
      authProp: { access_token: 'token', data: {} },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
    });
    expect(result).toEqual('mockBody');
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      authentication: { token: 'token', type: 'BEARER_TOKEN' },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
      method: 'GET',
      queryParams: { queryParams: 'queryParamsValue' },
      url: 'https://api.github.com/someUrl',
    });
  });

  test('should throw if send throws', async () => {
    httpClientMock.sendRequest.mockRejectedValue(new Error('mockError'));

    await expect(
      makeRequest({
        url: 'someUrl',
        httpMethod: HttpMethod.GET,
        authProp: { access_token: 'token', data: {} },
      }),
    ).rejects.toThrow('mockError');
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      authentication: { token: 'token', type: 'BEARER_TOKEN' },
      body: undefined,
      headers: undefined,
      method: 'GET',
      queryParams: undefined,
      url: 'https://api.github.com/someUrl',
    });
  });
});

describe('makePaginatedRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should make a request and return the data when there are no next pages', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: ['mockBody'],
    });

    const result = await makePaginatedRequest({
      url: 'someUrl',
      httpMethod: HttpMethod.GET,
      queryParams: { queryParams: 'queryParamsValue', per_page: '10' },
      authProp: { access_token: 'token', data: {} },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
    });
    expect(result).toEqual(['mockBody']);
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      authentication: { token: 'token', type: 'BEARER_TOKEN' },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
      method: 'GET',
      queryParams: { queryParams: 'queryParamsValue', per_page: '10' },
      url: 'https://api.github.com/someUrl',
    });
  });

  test('should make a request and return the aggregated data when there are next pages', async () => {
    httpClientMock.sendRequest
      .mockResolvedValueOnce({
        body: ['mockBody1'],
        headers: {
          link: '<https://api.github.com/someUrl?page=2>; rel="next"',
        },
      })
      .mockResolvedValueOnce({
        body: ['mockBody2'],
        headers: {
          link: '<https://api.github.com/someUrl?page=3>; rel="next"',
        },
      })
      .mockResolvedValueOnce({
        body: ['mockBody3'],
        headers: {
          link: '<https://api.github.com/someUrl?page=4>; rel="last"',
        },
      });

    const result = await makePaginatedRequest({
      url: 'someUrl',
      httpMethod: HttpMethod.GET,
      queryParams: { per_page: '1' },
      authProp: { access_token: 'token', data: {} },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
    });
    expect(result).toEqual(['mockBody1', 'mockBody2', 'mockBody3']);
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(3);
    expect(httpClientMock.sendRequest).toHaveBeenLastCalledWith({
      authentication: { token: 'token', type: 'BEARER_TOKEN' },
      body: { bodyKey: 'bodyValue' },
      headers: { headerKey: 'headersValue' },
      method: 'GET',
      queryParams: { per_page: '1' },
      url: 'https://api.github.com/someUrl?page=3',
    });
  });

  test('should throw if send throws', async () => {
    httpClientMock.sendRequest.mockRejectedValue(new Error('mockError'));

    await expect(
      makePaginatedRequest({
        url: 'someUrl',
        httpMethod: HttpMethod.GET,
        authProp: { access_token: 'token', data: {} },
      }),
    ).rejects.toThrow('mockError');
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      authentication: { token: 'token', type: 'BEARER_TOKEN' },
      body: undefined,
      headers: undefined,
      method: 'GET',
      queryParams: { per_page: '100' },
      url: 'https://api.github.com/someUrl',
    });
  });
});
