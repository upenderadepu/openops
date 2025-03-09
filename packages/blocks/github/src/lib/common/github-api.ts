import { HttpMethod } from '@openops/blocks-common';
import { OAuth2PropertyValue } from '@openops/blocks-framework';
import { makePaginatedRequest, makeRequest } from './http-request';

export async function getWorkflow(
  owner: string,
  repo: string,
  path: string,
  authProp: OAuth2PropertyValue,
  headers: any,
): Promise<string> {
  return makeRequest({
    url: `repos/${owner}/${repo}/contents/${path}`,
    httpMethod: HttpMethod.GET,
    authProp,
    headers,
  });
}

export async function getUserRepo(
  authProp: OAuth2PropertyValue,
): Promise<GithubRepository[]> {
  return makePaginatedRequest({
    url: 'user/repos',
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export async function listWorkflows(
  owner: string,
  repo: string,
  authProp: OAuth2PropertyValue,
): Promise<{ total_count: any; workflows: GithubWorkflow[] }> {
  return makeRequest({
    url: `repos/${owner}/${repo}/actions/workflows`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export async function listBranches(
  owner: string,
  repo: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubBranch[]> {
  return makePaginatedRequest({
    url: `repos/${owner}/${repo}/branches`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export async function getRepositoryContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  authProp: OAuth2PropertyValue,
): Promise<RepositoryContent> {
  return makeRequest({
    url: `repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
    headers: { accept: 'application/vnd.github.object+json' },
  });
}

export async function getCurrentHeadReference(
  owner: string,
  repo: string,
  baseBranch: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubReference> {
  return await makeRequest<GithubReference>({
    url: `repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export async function createNewBranchReference(
  owner: string,
  repo: string,
  newBranch: string,
  latestCommitSha: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubReference> {
  return makeRequest({
    url: `repos/${owner}/${repo}/git/refs`,
    httpMethod: HttpMethod.POST,
    authProp: authProp,
    body: {
      ref: `refs/heads/${newBranch}`,
      sha: latestCommitSha,
    },
  });
}

export async function updateFile(
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  commitMessage: string,
  originalFileSha: string,
  encodedContent: string,
  authProp: OAuth2PropertyValue,
): Promise<RepositoryContent> {
  return makeRequest({
    url: `repos/${owner}/${repo}/contents/${filePath}`,
    httpMethod: HttpMethod.PUT,
    authProp: authProp,
    body: {
      message: commitMessage,
      content: encodedContent,
      sha: originalFileSha,
      branch: branch,
    },
  });
}

export async function createPullRequest(
  owner: string,
  repo: string,
  headBranch: string,
  baseBranch: string,
  title: string,
  prDescription: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubPullRequest> {
  return makeRequest({
    headers: { accept: 'application/vnd.github.object+json' },
    url: `repos/${owner}/${repo}/pulls`,
    httpMethod: HttpMethod.POST,
    authProp: authProp,
    body: {
      title,
      body: prDescription,
      head: headBranch,
      base: baseBranch,
    },
  });
}

export async function addReviewersPullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  reviewers: string[],
  team_reviewers: string[],
  authProp: OAuth2PropertyValue,
): Promise<GithubPullRequest> {
  return makeRequest({
    url: `repos/${owner}/${repo}/pulls/${pullNumber}/requested_reviewers`,
    httpMethod: HttpMethod.POST,
    authProp: authProp,
    body: {
      reviewers: reviewers,
      team_reviewers: team_reviewers,
    },
  });
}

export async function getCollaborators(
  owner: string,
  repo: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubCollaborator[]> {
  return makePaginatedRequest({
    url: `repos/${owner}/${repo}/collaborators`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export async function getRepositoryTeams(
  owner: string,
  repo: string,
  authProp: OAuth2PropertyValue,
): Promise<GithubTeam[]> {
  return makePaginatedRequest({
    url: `repos/${owner}/${repo}/teams`,
    httpMethod: HttpMethod.GET,
    authProp: authProp,
  });
}

export interface GithubRepository {
  name: string;
  owner: {
    login: string;
  };
}

export interface GithubWorkflow {
  id: string;
  path: string;
}

export interface GithubBranch {
  name: string;
}

export interface WorkflowInput {
  default?: string;
  required?: boolean;
  type?: string;
  description?: string;
}

export interface WorkflowConfig {
  on?: {
    workflow_dispatch?: {
      inputs?: Record<string, WorkflowInput>;
    };
  };
}

export interface RepositoryContent {
  type: string;
  entries: any;
  content: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  encoding: string;
}

export interface GithubReference {
  ref: string;
  url: string;
  node_id: string;
  object: {
    type: string;
    sha: string;
    url: string;
  };
}

export interface GithubPullRequest {
  html_url: string;
  title: string;
  body: string;
  number: number;
}

export interface GithubCollaborator {
  login: string;
  id: number;
}

export interface GithubTeam {
  name: string;
  slug: string;
}
