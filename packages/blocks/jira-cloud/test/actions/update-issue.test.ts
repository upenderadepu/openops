const updateJiraIssueMock = jest.fn();

jest.mock('../../src/lib/common', () => ({
  updateJiraIssue: updateJiraIssueMock,
}));

import { updateIssueAction } from '../../src/lib/actions/update-issue';

describe('updateIssueAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const auth = {
    instanceUrl: 'some url',
    email: 'some email',
    apiToken: 'some api token',
  };

  test('should create action with correct properties', () => {
    expect(updateIssueAction.props).toMatchObject({
      projectId: {
        required: true,
        type: 'DROPDOWN',
      },
      issueId: {
        required: true,
        type: 'DROPDOWN',
      },
      issueTypeId: {
        required: false,
        type: 'DROPDOWN',
      },
      summary: {
        required: false,
        type: 'SHORT_TEXT',
      },
      description: {
        required: false,
        type: 'LONG_TEXT',
      },
      assignee: {
        required: false,
        type: 'DROPDOWN',
      },
      priority: {
        required: false,
        type: 'DROPDOWN',
      },
      parentKey: {
        required: false,
        type: 'SHORT_TEXT',
      },
      labels: {
        required: false,
        type: 'MULTI_SELECT_DROPDOWN',
      },
    });
  });

  test('should update an issue', async () => {
    updateJiraIssueMock.mockResolvedValue('mock result');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        projectId: 2,
        issueId: 'some issueId',
        issueTypeId: 'some issueTypeId',
        summary: 'some summary',
        description: 'some description',
        assignee: 'some assignee',
        priority: 'some priority',
        parentKey: 'some parentKey',
        labels: 'some label',
      },
    };

    const result = await updateIssueAction.run(context);

    expect(result).toBe('mock result');

    expect(updateJiraIssueMock).toHaveBeenCalledTimes(1);
    expect(updateJiraIssueMock).toHaveBeenCalledWith({
      assignee: 'some assignee',
      auth: {
        apiToken: 'some api token',
        email: 'some email',
        instanceUrl: 'some url',
      },
      description: 'some description',
      issueId: 'some issueId',
      issueTypeId: 'some issueTypeId',
      labels: ['some label'],
      parentKey: 'some parentKey',
      priority: 'some priority',
      summary: 'some summary',
    });
  });

  test.each([
    [undefined, undefined],
    [null, undefined],
    ['', undefined],
    ['label1', ['label1']],
    [['label1'], ['label1']],
    [
      ['label1', 'label2'],
      ['label1', 'label2'],
    ],
    [[], []],
  ])(
    'should update an issue when labels=%p',
    async (labelsInput, expectedLabels) => {
      updateJiraIssueMock.mockResolvedValue('mock result');

      const context = {
        ...jest.requireActual('@openops/blocks-framework'),
        auth: auth,
        propsValue: {
          projectId: 2,
          issueId: 'some issueId',
          issueTypeId: 'some issueTypeId',
          summary: 'some summary',
          description: 'some description',
          assignee: 'some assignee',
          priority: 'some priority',
          parentKey: 'some parentKey',
          labels: labelsInput,
        },
      };

      const result = await updateIssueAction.run(context);

      expect(result).toBe('mock result');

      expect(updateJiraIssueMock).toHaveBeenCalledTimes(1);
      expect(updateJiraIssueMock).toHaveBeenCalledWith({
        assignee: 'some assignee',
        auth: {
          apiToken: 'some api token',
          email: 'some email',
          instanceUrl: 'some url',
        },
        issueId: 'some issueId',
        description: 'some description',
        issueTypeId: 'some issueTypeId',
        labels: expectedLabels,
        parentKey: 'some parentKey',
        priority: 'some priority',
        summary: 'some summary',
      });
    },
  );
});
