import { slack } from '../src/index';

describe('block declaration tests', () => {
  test('should return correct display name', () => {
    expect(slack.displayName).toEqual('Slack');
  });

  test('should return correct actions', () => {
    expect(Object.keys(slack.actions()).length).toBe(5);
    expect(slack.actions()).toMatchObject({
      request_action_message: {
        name: 'request_action_message',
      },
      send_slack_message: {
        name: 'send_slack_message',
      },
      updateMessage: {
        name: 'updateMessage',
      },
      custom_api_call: {
        name: 'custom_api_call',
      },
      wait_for_action: {
        name: 'wait_for_action',
      },
    });
  });
});
