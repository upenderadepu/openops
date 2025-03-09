const makeRequestMock = {
  makeRequest: jest.fn(),
  makePaginatedRequest: jest.fn(),
};

jest.mock('../src/lib/common/http-request', () => makeRequestMock);

import { HttpMethod } from '@openops/blocks-common';
import * as GitApi from '../src/lib/common/github-api';

const auth = {
  access_token: 'some access token',
  data: {},
};

describe('common', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserRepo', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makePaginatedRequest.mockResolvedValue('mock response');

      const result = await GitApi.getUserRepo(auth);

      expect(result).toEqual('mock response');
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledWith({
        url: 'user/repos',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });

  describe('listWorkflows', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.listWorkflows('owner', 'repo', auth);

      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/actions/workflows',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });

  describe('listBranches', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makePaginatedRequest.mockResolvedValue('mock response');

      const result = await GitApi.listBranches('owner', 'repo', auth);
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/branches',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });

  describe('getWorkflow', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.getWorkflow('owner', 'repo', 'path', auth, {
        header: 'header',
      });
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/contents/path',
        httpMethod: HttpMethod.GET,
        authProp: auth,
        headers: { header: 'header' },
      });
    });
  });

  describe('listRepositoryContent', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.getRepositoryContent(
        'owner',
        'repo',
        'branch',
        'path',
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/contents/path?ref=branch',
        httpMethod: HttpMethod.GET,
        authProp: auth,
        headers: { accept: 'application/vnd.github.object+json' },
      });
    });
  });

  describe('getCurrentHeadReference', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.getCurrentHeadReference(
        'owner',
        'repo',
        'branch',
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/git/ref/heads/branch',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });

  describe('createNewBranchReference', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.createNewBranchReference(
        'owner',
        'repo',
        'branch',
        'latestCommitSha',
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/git/refs',
        httpMethod: HttpMethod.POST,
        authProp: auth,
        body: { ref: 'refs/heads/branch', sha: 'latestCommitSha' },
      });
    });
  });

  describe('updateFile', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.updateFile(
        'owner',
        'repo',
        'branch',
        'filePath',
        'commitMessage',
        'originalFileSha',
        'encodedContent',
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/contents/filePath',
        httpMethod: HttpMethod.PUT,
        authProp: auth,
        body: {
          message: 'commitMessage',
          content: 'encodedContent',
          sha: 'originalFileSha',
          branch: 'branch',
        },
      });
    });
  });

  describe('createPullRequest', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.createPullRequest(
        'owner',
        'repo',
        'headBranch',
        'baseBranch',
        'title',
        'prDescription',
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/pulls',
        httpMethod: HttpMethod.POST,
        authProp: auth,
        headers: { accept: 'application/vnd.github.object+json' },
        body: {
          title: 'title',
          body: 'prDescription',
          head: 'headBranch',
          base: 'baseBranch',
        },
      });
    });
  });

  describe('addReviewersPullRequest', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makeRequest.mockResolvedValue('mock response');

      const result = await GitApi.addReviewersPullRequest(
        'owner',
        'repo',
        1,
        ['reviewers'],
        ['team_reviewers'],
        auth,
      );
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makeRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makeRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/pulls/1/requested_reviewers',
        httpMethod: HttpMethod.POST,
        authProp: auth,
        body: {
          reviewers: ['reviewers'],
          team_reviewers: ['team_reviewers'],
        },
      });
    });
  });

  describe('getCollaborators', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makePaginatedRequest.mockResolvedValue('mock response');

      const result = await GitApi.getCollaborators('owner', 'repo', auth);
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/collaborators',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });

  describe('getRepositoryTeams', () => {
    test('should make request with given values', async () => {
      makeRequestMock.makePaginatedRequest.mockResolvedValue('mock response');

      const result = await GitApi.getRepositoryTeams('owner', 'repo', auth);
      expect(result).toEqual('mock response');
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledTimes(1);
      expect(makeRequestMock.makePaginatedRequest).toHaveBeenCalledWith({
        url: 'repos/owner/repo/teams',
        httpMethod: HttpMethod.GET,
        authProp: auth,
      });
    });
  });
});
