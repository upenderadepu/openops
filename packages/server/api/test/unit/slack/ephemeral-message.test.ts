const httpClientMock = {
  sendRequest: jest.fn(),
};

jest.mock('@openops/blocks-common', () => {
  return {
    ...jest.requireActual('@openops/blocks-common'),
    httpClient: httpClientMock,
  };
});

import { HttpMethod } from '@openops/blocks-common';
import { sendEphemeralMessage } from '../../../src/app/slack/ephemeral-message';

describe('sendEphemeralMessage', () => {
  beforeEach(() => {
    httpClientMock.sendRequest.mockClear();
  });

  test('should make POST request to send a ephemeral message', async () => {
    httpClientMock.sendRequest.mockResolvedValue({ body: { ok: true } });

    const response = await sendEphemeralMessage({
      responseUrl:
        'https://hooks.slack.com/actions/XXXXXXXX/XXXXXXXXX/XXXXXXXXX',
      ephemeralText: 'some text',
      userId: 'some userId',
    });
    expect(httpClientMock.sendRequest).toHaveBeenCalledTimes(1);

    expect(httpClientMock.sendRequest).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      url: 'https://hooks.slack.com/actions/XXXXXXXX/XXXXXXXXX/XXXXXXXXX',
      body: {
        text: 'some text',
        response_type: 'ephemeral',
        replace_original: false,
        user: 'some userId',
      },
    });

    expect(response).toEqual({ body: { ok: true } });
  });
});
