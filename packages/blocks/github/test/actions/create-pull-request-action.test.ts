const gitWrapperMock = {
  createNewBranch: jest.fn(),
  getGitHubFile: jest.fn(),
  updateFile: jest.fn(),
  createPullRequest: jest.fn(),
  addPullRequestReviewers: jest.fn(),
};

jest.mock('../../src/lib/common/github-wrapper', () => gitWrapperMock);

import { createPullRequestAction } from '../../src/lib/actions/create-pull-request-action';

const auth = {
  access_token: 'some access token',
};

describe('Create pull request action', () => {
  const mockTimestamp = 1700000000;
  const originalDateNow = Date.now;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    global.Date.now = jest.fn(() => mockTimestamp);
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });

  test('should create action with correct properties', () => {
    expect(createPullRequestAction.props).toMatchObject({
      repository: {
        type: 'DROPDOWN',
        required: true,
      },
      baseBranch: {
        type: 'DROPDOWN',
        required: true,
      },
      filePath: {
        type: 'SHORT_TEXT',
        required: true,
      },
      newFileContent: {
        type: 'SHORT_TEXT',
        required: true,
      },
      title: {
        type: 'SHORT_TEXT',
        required: true,
      },
      description: {
        type: 'LONG_TEXT',
        required: true,
      },
      reviewers: {
        type: 'MULTI_SELECT_DROPDOWN',
        required: false,
      },
      teamReviewers: {
        type: 'MULTI_SELECT_DROPDOWN',
        required: false,
      },
    });
  });

  test.each([
    [['reviewers'], ['teamReviewers']],
    [['reviewers'], []],
    [[], ['teamReviewers']],
    ['reviewers', ''],
    ['', 'teamReviewers'],
    ['reviewers', 'teamReviewers'],
  ])(
    'should run the action successfully and create the pull request with reviewers',
    async (reviewers: any, teamReviewers: any) => {
      await sharedTestCodeAndValidations(reviewers, teamReviewers);

      expect(gitWrapperMock.addPullRequestReviewers).toHaveBeenCalledTimes(1);
      const reviewersList = Array.isArray(reviewers) ? reviewers : [reviewers];
      const teamReviewersList = Array.isArray(teamReviewers)
        ? teamReviewers
        : [teamReviewers];
      expect(gitWrapperMock.addPullRequestReviewers).toHaveBeenCalledWith(
        'ownerName',
        'repoName',
        1,
        reviewersList,
        teamReviewersList,
        auth,
      );
    },
  );

  test.each([
    [[], []],
    ['', ''],
    [' ', ' '],
    [undefined, undefined],
  ])(
    'should run the action successfully and create the pull request without reviewers',
    async (reviewers: any, teamReviewers: any) => {
      await sharedTestCodeAndValidations(reviewers, teamReviewers);

      expect(gitWrapperMock.addPullRequestReviewers).toHaveBeenCalledTimes(0);
    },
  );

  test('should throw an exception when failing to get a file from github, branch should not be created', async () => {
    gitWrapperMock.getGitHubFile.mockRejectedValue(
      new Error('Error getting file'),
    );
    gitWrapperMock.createPullRequest.mockResolvedValue({
      number: 1,
      html_url: 'html_url',
    });

    const context = createContext({
      repository: { owner: 'ownerName', repo: 'repoName' },
      baseBranch: 'baseBranch',
      filePath: 'filePath',
      newFileContent: 'newFileContent',
      title: 'title',
      description: 'description',
      reviewers: [],
      teamReviewers: '',
    });

    await expect(createPullRequestAction.run(context)).rejects.toThrow(
      'Error getting file',
    );

    expect(gitWrapperMock.getGitHubFile).toHaveBeenCalledTimes(1);
    expect(gitWrapperMock.getGitHubFile).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'baseBranch',
      'filePath',
      auth,
    );
    expect(gitWrapperMock.createNewBranch).toHaveBeenCalledTimes(0);
  });

  async function sharedTestCodeAndValidations(
    reviewers: any,
    teamReviewers: any,
  ) {
    gitWrapperMock.getGitHubFile.mockResolvedValue({
      sha: 'sha',
    });
    gitWrapperMock.createPullRequest.mockResolvedValue({
      number: 1,
      html_url: 'html_url',
    });

    const context = createContext({
      repository: { owner: 'ownerName', repo: 'repoName' },
      baseBranch: 'baseBranch',
      filePath: 'filePath',
      newFileContent: 'newFileContent',
      title: 'title',
      description: 'description',
      reviewers: reviewers,
      teamReviewers: teamReviewers,
    });

    const newContentEncoded = Buffer.from('newFileContent').toString('base64');

    const result = (await createPullRequestAction.run(context)) as any;

    expect(result).toEqual('html_url');
    expect(gitWrapperMock.getGitHubFile).toHaveBeenCalledTimes(1);
    expect(gitWrapperMock.getGitHubFile).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'baseBranch',
      'filePath',
      auth,
    );
    expect(gitWrapperMock.createNewBranch).toHaveBeenCalledTimes(1);
    expect(gitWrapperMock.createNewBranch).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'baseBranch',
      'openops/test-1700000000',
      auth,
    );
    expect(gitWrapperMock.updateFile).toHaveBeenCalledTimes(1);
    expect(gitWrapperMock.updateFile).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'openops/test-1700000000',
      'filePath',
      'title',
      'sha',
      newContentEncoded,
      auth,
    );
    expect(gitWrapperMock.createPullRequest).toHaveBeenCalledTimes(1);
    expect(gitWrapperMock.createPullRequest).toHaveBeenCalledWith(
      'ownerName',
      'repoName',
      'openops/test-1700000000',
      'baseBranch',
      'title',
      'description',
      auth,
    );
  }
});

interface ContextParams {
  repository?: {
    owner: string;
    repo: string;
  };
  baseBranch: string;
  filePath: string;
  newFileContent: string;
  title: string;
  description: string;
  reviewers: unknown;
  teamReviewers: unknown;
}

function createContext(params?: ContextParams) {
  return {
    ...jest.requireActual('@openops/blocks-framework'),
    auth: auth,
    run: {
      name: 'test',
    },
    propsValue: {
      repository: params?.repository,
      baseBranch: params?.baseBranch,
      filePath: params?.filePath,
      newFileContent: params?.newFileContent,
      title: params?.title,
      description: params?.description,
      reviewers: params?.reviewers,
      teamReviewers: params?.teamReviewers,
    },
  };
}
