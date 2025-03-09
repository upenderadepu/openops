const httpClientMock = {
  sendRequest: jest.fn(),
};

jest.mock('@openops/blocks-common', () => {
  return {
    ...jest.requireActual('@openops/blocks-common'),
    httpClient: httpClientMock,
  };
});

import { AuthenticationType, HttpMethod } from '@openops/blocks-common';
import {
  getUserIdFromEmail,
  getUserInfo,
  slackUpdateMessage,
} from '../src/lib/common/utils';

describe('getUserIdFromEmail', () => {
  beforeEach(() => {
    httpClientMock.sendRequest.mockClear();
  });

  test('should return the correct user id', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: { ok: true, user: { id: 'someUserId' } },
    });

    const response = await getUserIdFromEmail('some accessToken', 'someOwner');
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: `https://slack.com/api/users.lookupByEmail?email=someOwner`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some accessToken',
      },
    });

    expect(response).toBe('someUserId');
  });

  test('should throw if error gets returned', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: { ok: false, error: 'some error' },
    });

    await expect(
      getUserIdFromEmail('some accessToken', 'someOwnerEmail'),
    ).rejects.toThrow(
      `Error getting user id from email failed with error: some error for email: someOwnerEmail`,
    );

    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: `https://slack.com/api/users.lookupByEmail?email=someOwnerEmail`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some accessToken',
      },
    });
  });
});

describe('getUserInfo', () => {
  beforeEach(() => {
    httpClientMock.sendRequest.mockClear();
  });

  test('should return the correct info for user', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: { ok: true, user: { someinfo: 'info' } },
    });

    const response = await getUserInfo('some accessToken', 'some user id');
    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: 'https://slack.com/api/users.info?user=some user id',
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some accessToken',
      },
    });

    expect(response).toStrictEqual({ someinfo: 'info' });
  });

  test('should throw if error gets returned', async () => {
    httpClientMock.sendRequest.mockResolvedValue({
      body: { ok: false, error: 'some error' },
    });

    await expect(
      getUserInfo('some accessToken', 'some user id'),
    ).rejects.toThrow(`Error getting info from user: some error`);

    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      url: 'https://slack.com/api/users.info?user=some user id',
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some accessToken',
      },
    });
  });
});

describe('slackUpdateMessage', () => {
  beforeEach(() => {
    httpClientMock.sendRequest.mockClear();
  });

  test('should make HTTP request to update message', async () => {
    httpClientMock.sendRequest.mockResolvedValue({ body: { ok: true } });

    const response = await slackUpdateMessage({
      token: 'some accessToken',
      text: 'some text',
      conversationId: 'some channel',
      messageTimestamp: '123456',
      blocks: [{ some: 'block' }],
    });

    expect(response).toEqual({
      success: true,
      request_body: {
        channel: 'some channel',
        ts: '123456',
        blocks: [{ some: 'block' }],
        text: 'some text',
      },
      response_body: { ok: true },
    });

    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: `https://slack.com/api/chat.update`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: 'some accessToken',
      },
      body: {
        channel: 'some channel',
        ts: '123456',
        blocks: [{ some: 'block' }],
        text: 'some text',
      },
    });
  });
});
