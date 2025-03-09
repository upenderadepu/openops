const slackUpdateMessageMock = jest.fn();
jest.mock('../src/lib/common/utils', () => ({
  slackUpdateMessage: slackUpdateMessageMock,
}));

import { updateMessageAction } from '../src/lib/actions/update-message-action';

const mockContext = {
  ...jest.requireActual('@openops/blocks-framework'),
  auth: {
    access_token: 'fake_token',
  },
  propsValue: {
    channel: 'C123456',
    text: 'Hello, world!',
    file: null,
    threadTs: null,
    blocks: [],
    ts: 12345678,
  },
  server: {
    publicUrl: 'http://example.com',
  },
  run: {
    pauseId: 'pause_123',
  },
  store: {
    put: jest.fn(),
  },
  generateResumeUrl: jest.fn().mockReturnValue('http://example.com/resume'),
};

describe('updateMessageAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update a message successfully', async () => {
    slackUpdateMessageMock.mockResolvedValue({ response_body: { ok: true } });

    const response = await updateMessageAction.run(mockContext);

    expect(slackUpdateMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fake_token',
        text: 'Hello, world!',
        conversationId: 'C123456',
        blocks: [],
        messageTimestamp: 12345678,
        metadata: { event_type: 'slack-message' },
      }),
    );

    expect(response).toEqual({ response_body: { ok: true } });
  });

  test('should throw an error if unable to update a message', async () => {
    slackUpdateMessageMock.mockResolvedValue({
      response_body: { ok: false, error: 'channel_not_found' },
    });

    await expect(updateMessageAction.run(mockContext)).rejects.toThrow(
      'Error updating Slack message: channel_not_found',
    );
  });
});
