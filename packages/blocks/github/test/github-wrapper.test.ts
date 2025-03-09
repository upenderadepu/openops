const gitApi = {
  updateFile: jest.fn(),
  createPullRequest: jest.fn(),
  getRepositoryContent: jest.fn(),
  addReviewersPullRequest: jest.fn(),
  getCurrentHeadReference: jest.fn(),
  createNewBranchReference: jest.fn(),
};

jest.mock('../src/lib/common/github-api', () => gitApi);

import { HttpError } from '@openops/blocks-common';
import { OAuth2PropertyValue } from '@openops/blocks-framework';
import { AxiosError, AxiosHeaders } from 'axios';
import * as GitWrapper from '../src/lib/common/github-wrapper';

const mockAuth: OAuth2PropertyValue = {
  access_token: 'mock-token',
  data: [],
};

const owner = 'test-owner';
const repo = 'test-repo';
const baseBranch = 'test-base-branch';
const newBranch = 'test-new-branch';
const path = 'test-path';
const title = 'test-title';
const fileSha = 'test-file-sha';
const newContentEncoded = 'test-new-content-encoded';

const httpError = new HttpError(
  undefined,
  new AxiosError('', '', undefined, undefined, {
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { message: 'Async error message' },
    status: 500,
  }),
);

describe('Get GitHub file', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get the file from github', async () => {
    const mockResponse = { type: 'dir' };
    gitApi.getRepositoryContent.mockResolvedValue(mockResponse);

    const result = await GitWrapper.getGitHubFile(
      owner,
      repo,
      baseBranch,
      path,
      mockAuth,
    );

    expect(result).toEqual(mockResponse);
    expect(gitApi.getRepositoryContent).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      path,
      mockAuth,
    );
  });

  it('should throw an error if the http request fails with an http error', async () => {
    gitApi.getRepositoryContent.mockRejectedValue(httpError);

    await expect(
      GitWrapper.getGitHubFile(owner, repo, baseBranch, path, mockAuth),
    ).rejects.toThrow(
      'An error occurred getting the file from the repository. Status: 500; Message: Async error message',
    );

    expect(gitApi.getRepositoryContent).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      path,
      mockAuth,
    );
  });

  it('should return an error if the http request fails with an unknown error', async () => {
    gitApi.getRepositoryContent.mockRejectedValue(
      new Error('Async error message'),
    );

    await expect(
      GitWrapper.getGitHubFile(owner, repo, baseBranch, path, mockAuth),
    ).rejects.toThrow(
      'An error occurred getting the file from the repository. Error: Async error message',
    );

    expect(gitApi.getRepositoryContent).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      path,
      mockAuth,
    );
  });
});

describe('Create new branch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new branch on github', async () => {
    gitApi.getCurrentHeadReference.mockResolvedValue({
      object: { sha: 'sha' },
    });
    gitApi.createNewBranchReference.mockResolvedValue({ url: 'url' });

    await GitWrapper.createNewBranch(
      owner,
      repo,
      baseBranch,
      newBranch,
      mockAuth,
    );

    expect(gitApi.getCurrentHeadReference).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      mockAuth,
    );
    expect(gitApi.createNewBranchReference).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      'sha',
      mockAuth,
    );
  });

  it('should throw an error if the http request fails with an http error', async () => {
    gitApi.getCurrentHeadReference.mockRejectedValue(httpError);

    await expect(
      GitWrapper.createNewBranch(owner, repo, baseBranch, newBranch, mockAuth),
    ).rejects.toThrow(
      'An error occurred creating a new branch. Status: 500; Message: Async error message',
    );

    expect(gitApi.getCurrentHeadReference).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      mockAuth,
    );
  });

  it('should ignore the error if the branch is already created', async () => {
    gitApi.getCurrentHeadReference.mockRejectedValue(
      new Error('Reference already exists'),
    );

    await GitWrapper.createNewBranch(
      owner,
      repo,
      baseBranch,
      newBranch,
      mockAuth,
    );

    expect(gitApi.getCurrentHeadReference).toHaveBeenCalledWith(
      owner,
      repo,
      baseBranch,
      mockAuth,
    );
  });
});

describe('Update file', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a file on github', async () => {
    gitApi.updateFile.mockResolvedValue('mockResponse');

    await GitWrapper.updateFile(
      owner,
      repo,
      newBranch,
      path,
      title,
      fileSha,
      newContentEncoded,
      mockAuth,
    );

    expect(gitApi.updateFile).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      path,
      title,
      fileSha,
      newContentEncoded,
      mockAuth,
    );
  });

  it('should throw an error if the http request fails with an http error', async () => {
    gitApi.updateFile.mockRejectedValue(httpError);

    await expect(
      GitWrapper.updateFile(
        owner,
        repo,
        newBranch,
        path,
        title,
        fileSha,
        newContentEncoded,
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred while updating the file in the repository. Status: 500; Message: Async error message',
    );

    expect(gitApi.updateFile).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      path,
      title,
      fileSha,
      newContentEncoded,
      mockAuth,
    );
  });

  it('should return an error if the http request fails with an unknown error', async () => {
    gitApi.updateFile.mockRejectedValue(new Error('Async error message'));

    await expect(
      GitWrapper.updateFile(
        owner,
        repo,
        newBranch,
        path,
        title,
        fileSha,
        newContentEncoded,
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred while updating the file in the repository. Error: Async error message',
    );

    expect(gitApi.updateFile).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      path,
      title,
      fileSha,
      newContentEncoded,
      mockAuth,
    );
  });
});

describe('Create Pull Request', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new pull request on github', async () => {
    const mockResponse = { html_url: 'html_url' };
    gitApi.createPullRequest.mockResolvedValue(mockResponse);

    const result = await GitWrapper.createPullRequest(
      owner,
      repo,
      newBranch,
      baseBranch,
      title,
      'description',
      mockAuth,
    );

    expect(result).toEqual(mockResponse);
    expect(gitApi.createPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      baseBranch,
      title,
      'description',
      mockAuth,
    );
  });

  it('should throw an error if the http request fails with an http error', async () => {
    gitApi.createPullRequest.mockRejectedValue(httpError);

    await expect(
      GitWrapper.createPullRequest(
        owner,
        repo,
        newBranch,
        baseBranch,
        title,
        'description',
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred creating the pull request. Status: 500; Message: Async error message',
    );

    expect(gitApi.createPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      baseBranch,
      title,
      'description',
      mockAuth,
    );
  });

  it('should return an error if the http request fails with an unknown error', async () => {
    gitApi.createPullRequest.mockRejectedValue(
      new Error('Async error message'),
    );

    await expect(
      GitWrapper.createPullRequest(
        owner,
        repo,
        newBranch,
        baseBranch,
        title,
        'description',
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred creating the pull request. Error: Async error message',
    );

    expect(gitApi.createPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      newBranch,
      baseBranch,
      title,
      'description',
      mockAuth,
    );
  });
});

describe('Add pull request reviewers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully add reviewers to a pull request on github', async () => {
    const mockResponse = { html_url: 'html_url' };
    gitApi.addReviewersPullRequest.mockResolvedValue(mockResponse);

    const result = await GitWrapper.addPullRequestReviewers(
      owner,
      repo,
      1,
      ['reviewers'],
      ['team_reviewers'],
      mockAuth,
    );

    expect(result).toEqual(mockResponse);
    expect(gitApi.addReviewersPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      1,
      ['reviewers'],
      ['team_reviewers'],
      mockAuth,
    );
  });

  it('should throw an error if the http request fails with an http error', async () => {
    gitApi.addReviewersPullRequest.mockRejectedValue(httpError);

    await expect(
      GitWrapper.addPullRequestReviewers(
        owner,
        repo,
        1,
        ['reviewers'],
        ['team_reviewers'],
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred adding reviewers to the pull request. Status: 500; Message: Async error message',
    );

    expect(gitApi.addReviewersPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      1,
      ['reviewers'],
      ['team_reviewers'],
      mockAuth,
    );
  });

  it('should return an error if the http request fails with an unknown error', async () => {
    gitApi.addReviewersPullRequest.mockRejectedValue(
      new Error('Async error message'),
    );

    await expect(
      GitWrapper.addPullRequestReviewers(
        owner,
        repo,
        1,
        ['reviewers'],
        ['team_reviewers'],
        mockAuth,
      ),
    ).rejects.toThrow(
      'An error occurred adding reviewers to the pull request. Error: Async error message',
    );

    expect(gitApi.addReviewersPullRequest).toHaveBeenCalledWith(
      owner,
      repo,
      1,
      ['reviewers'],
      ['team_reviewers'],
      mockAuth,
    );
  });
});
