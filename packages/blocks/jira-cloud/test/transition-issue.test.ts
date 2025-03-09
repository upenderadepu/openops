const sendJiraRequestMock = jest.fn();

jest.mock('../src/lib/common', () => ({
  sendJiraRequest: sendJiraRequestMock,
}));

import { transitionIssueAction } from '../src/lib/actions/transition-issue';

describe('transitionIssueAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const auth = {
    instanceUrl: 'some url',
    email: 'some email',
    apiToken: 'some api token',
  };
  test('should create action with correct properties', () => {
    expect(transitionIssueAction.props).toMatchObject({
      projectId: {
        required: true,
        type: 'DROPDOWN',
      },
      issueId: {
        required: true,
        type: 'DROPDOWN',
      },
      newStatus: {
        required: true,
        type: 'DROPDOWN',
      },
    });
  });

  test('should populate transition dropdown with expected values', async () => {
    sendJiraRequestMock.mockResolvedValue({
      body: {
        transitions: [
          { name: 'transition one', id: 1 },
          { name: 'transition two', id: 2 },
          { name: 'transition three', id: 3 },
        ],
      },
    });

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        issueId: 'some issueId',
      },
    };

    const transitionProperty = await transitionIssueAction.props[
      'newStatus'
    ].options(
      { auth: context.auth, issueId: context.propsValue.issueId },
      context,
    );

    expect(transitionProperty.options).toMatchObject([
      { label: 'transition one', value: 1 },
      { label: 'transition two', value: 2 },
      { label: 'transition three', value: 3 },
    ]);
    expect(sendJiraRequestMock).toHaveBeenCalledTimes(1);
    expect(sendJiraRequestMock).toHaveBeenCalledWith({
      auth: auth,
      method: 'GET',
      url: 'issue/some issueId/transitions',
    });
  });

  test('should transition issue', async () => {
    sendJiraRequestMock.mockResolvedValue({ body: 'mock result' });

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        issueId: 'some issueId',
        newStatus: 1,
        projectId: 2,
      },
    };

    const result = await transitionIssueAction.run(context);

    expect(result).toBe('mock result');
    expect(sendJiraRequestMock).toHaveBeenCalledTimes(1);
    expect(sendJiraRequestMock).toHaveBeenCalledWith({
      auth: auth,
      method: 'POST',
      url: 'issue/some issueId/transitions',
      body: {
        transition: { id: 1 },
      },
    });
  });
});
