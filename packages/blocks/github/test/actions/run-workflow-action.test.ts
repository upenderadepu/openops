const makeRequestMock = {
  makeRequest: jest.fn(),
};

jest.mock('../../src/lib/common/http-request', () => makeRequestMock);

const commonMock = {
  ...jest.requireActual('../../src/lib/common/github-api'),
  getUserRepo: jest.fn(),
  listWorkflows: jest.fn(),
  listBranches: jest.fn(),
  getWorkflow: jest.fn(),
};

jest.mock('../../src/lib/common/github-api', () => commonMock);

import { runWorkflowAction } from '../../src/lib/actions/run-workflow-action';

const auth = {
  access_token: 'some access token',
};

describe('run workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create action with correct properties', () => {
    expect(runWorkflowAction.props).toMatchObject({
      repository: {
        type: 'DROPDOWN',
        required: true,
      },
      workflow: {
        type: 'DROPDOWN',
        required: true,
      },
      branch: {
        type: 'DROPDOWN',
        required: true,
      },
    });
  });

  test.each([
    [undefined, 'workflow'],
    [undefined, undefined],
    ['repo', undefined],
  ])(
    'should throw if repository or workflow are undefined',
    async (repo: any, workflow: any) => {
      const context = createContext({ workflow: workflow, repository: repo });

      await expect(runWorkflowAction.run(context)).rejects.toThrow(
        'An error occurred while running the workflow. Failed with: Error: Repository or Workflow is undefined',
      );
    },
  );

  test('should make request with expected input', async () => {
    makeRequestMock.makeRequest.mockResolvedValue('mock response');
    const context = createContext({
      repository: { owner: 'ownerName', repo: 'repoName' },
      workflow: { id: 'workflowId', path: 'workflowPath' },
      branch: 'branch',
      inputs: { input1: 'value1', input2: 'value2' },
    });

    const result = (await runWorkflowAction.run(context)) as any;

    expect(result).toEqual('mock response');
    expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
      url: 'repos/ownerName/repoName/actions/workflows/workflowId/dispatches',
      httpMethod: 'POST',
      authProp: auth,
      body: { ref: 'branch', inputs: { input1: 'value1', input2: 'value2' } },
    });
  });

  describe('workflow property', () => {
    test('should return empty if repository is undefined', async () => {
      const context = createContext();
      const result = await runWorkflowAction.props['workflow'].options(
        { auth: auth, repository: undefined },
        context,
      );

      expect(result).toMatchObject({
        disabled: true,
        options: [],
        placeholder: 'Please select a repository first',
      });
      expect(commonMock.listWorkflows).not.toHaveBeenCalled();
    });

    test('should return dropdown', async () => {
      commonMock.listWorkflows.mockResolvedValue({
        workflows: [
          { path: 'path1', id: 'id1' },
          { path: 'path2', id: 'id2' },
        ],
      });

      const context = createContext();
      const result = await runWorkflowAction.props['workflow'].options(
        { auth: auth, repository: { owner: 'some owner', repo: 'some repo' } },
        context,
      );

      expect(result).toMatchObject({
        disabled: false,
        options: [
          { label: 'path1', value: { path: 'path1', id: 'id1' } },
          { label: 'path2', value: { path: 'path2', id: 'id2' } },
        ],
      });
      expect(commonMock.listWorkflows).toHaveBeenCalledTimes(1);
      expect(commonMock.listWorkflows).toHaveBeenCalledWith(
        'some owner',
        'some repo',
        auth,
      );
    });
  });

  describe('Inputs property', () => {
    test('should return empty if workflow is undefined', async () => {
      const context = createContext();
      const result = await runWorkflowAction.props['inputs'].props(
        {
          auth: auth,
          repository: { owner: 'owner', repo: 'repo' },
          workflow: undefined as any,
        },
        context,
      );

      expect(result).toMatchObject({});
    });

    test('should return inputs', async () => {
      commonMock.getWorkflow.mockResolvedValue(`---
      on:
        workflow_dispatch:
          inputs:
            input1:
              default: some default value for input1
            input2:
              type: string
              description: some description1.
            input3:
              type: string
              description: some description2.
              required: true
              default: some default value for input2
      `);

      const context = createContext();
      const result = await runWorkflowAction.props['inputs'].props(
        {
          auth: auth,
          repository: { owner: 'some owner', repo: 'some repo' },
          workflow: { id: 'some id', path: 'some path' },
        },
        context,
      );

      expect(result).toMatchObject({
        input1: {
          defaultValue: 'some default value for input1',
          description: 'Input for input1',
          displayName: 'input1',
          required: false,
          type: 'LONG_TEXT',
          valueSchema: undefined,
        },
        input2: {
          defaultValue: '',
          description: 'some description1.',
          displayName: 'input2',
          required: false,
          type: 'LONG_TEXT',
          valueSchema: undefined,
        },
        input3: {
          defaultValue: 'some default value for input2',
          description: 'some description2.',
          displayName: 'input3',
          required: true,
          type: 'LONG_TEXT',
          valueSchema: undefined,
        },
      });
      expect(commonMock.getWorkflow).toHaveBeenCalledTimes(1);
      expect(commonMock.getWorkflow).toHaveBeenCalledWith(
        'some owner',
        'some repo',
        'some path',
        auth,
        { accept: 'application/vnd.github.v3.raw' },
      );
    });
  });
});

interface ContextParams {
  repository?: {
    owner: string;
    repo: string;
  };
  workflow?: {
    id: string;
    path: string;
  };
  branch?: string;
  inputs?: Record<string, string>;
}

function createContext(params?: ContextParams) {
  return {
    ...jest.requireActual('@openops/blocks-framework'),
    auth: auth,
    propsValue: {
      repository: params?.repository,
      workflow: params?.workflow,
      branch: params?.branch,
      inputs: params?.inputs,
    },
  };
}
