const commonMock = {
  ...jest.requireActual('../../src/lib/common/github-api'),
  getRepositoryContent: jest.fn(),
};

jest.mock('../../src/lib/common/github-api', () => commonMock);

import { getFileAction } from '../../src/lib/actions/get-file-action';

const auth = {
  access_token: 'some access token',
};

describe('run workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create action with correct properties', () => {
    expect(getFileAction.props).toMatchObject({
      repository: {
        type: 'DROPDOWN',
        required: true,
      },
      branch: {
        type: 'DROPDOWN',
        required: true,
      },
      filePath: {
        type: 'SHORT_TEXT',
        required: true,
      },
    });
  });

  test('should make request with expected input', async () => {
    commonMock.getRepositoryContent.mockResolvedValue({
      type: 'file',
      content: 'bW9jayByZXNwb25zZQ==', // mock response encoded in base64
    });
    const context = createContext({
      repository: { owner: 'ownerName', repo: 'repoName' },
      branch: 'branch',
      filePath: 'file path',
    });

    const result = (await getFileAction.run(context)) as any;

    expect(result).toEqual('mock response');
    expect(commonMock.getRepositoryContent).toHaveBeenCalledTimes(1);
    expect(commonMock.getRepositoryContent).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'branch',
      'file path',
      auth,
    );
  });

  test('should return an error if the response type is directory', async () => {
    commonMock.getRepositoryContent.mockResolvedValue({
      type: 'dir',
      content: '',
    });
    const context = createContext({
      repository: { owner: 'ownerName', repo: 'repoName' },
      branch: 'branch',
      filePath: 'file path',
    });

    await expect(getFileAction.run(context)).rejects.toThrow(
      "It looks like you've provided a directory path instead of a file path. Please make sure to provide the correct file path.",
    );

    expect(commonMock.getRepositoryContent).toHaveBeenCalledTimes(1);
    expect(commonMock.getRepositoryContent).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'branch',
      'file path',
      auth,
    );
  });
});

interface ContextParams {
  repository?: {
    owner: string;
    repo: string;
  };
  branch?: string;
  filePath?: string;
}

function createContext(params?: ContextParams) {
  return {
    ...jest.requireActual('@openops/blocks-framework'),
    auth: auth,
    propsValue: {
      repository: params?.repository,
      branch: params?.branch,
      filePath: params?.filePath,
    },
  };
}
