const commonMock = {
  ...jest.requireActual('../src/lib/common/github-api'),
  getRepositoryTeams: jest.fn(),
};

jest.mock('../src/lib/common/github-api', () => commonMock);

import { getTeamReviewersProperty } from '../src/lib/common/team-reviewers-property';

const auth = {
  access_token: 'some access token',
};

describe('Get Team Reviewers Property', () => {
  test('should return expected properties', async () => {
    const result = getTeamReviewersProperty();

    expect(result).toMatchObject({
      displayName: 'Team Reviewers',
      type: 'MULTI_SELECT_DROPDOWN',
      required: false,
    });
  });

  test('should return empty if repository is undefined', async () => {
    const property = getTeamReviewersProperty();
    const context = createContext();

    const result = await property.options(
      { auth: auth, repository: undefined },
      context,
    );

    expect(result).toMatchObject({
      disabled: true,
      options: [],
      placeholder: 'Please select a repository first',
    });

    expect(commonMock.getRepositoryTeams).not.toHaveBeenCalled();
  });

  test('should return dropdown', async () => {
    commonMock.getRepositoryTeams.mockResolvedValue([
      { name: 'name1', slug: 'slug1' },
      { name: 'name2', slug: 'slug2' },
    ]);

    const property = getTeamReviewersProperty();
    const context = createContext();

    const result = await property.options(
      { auth: auth, repository: { owner: 'some owner', repo: 'some repo' } },
      context,
    );

    expect(result).toMatchObject({
      disabled: false,
      options: [
        { label: 'name1', value: 'slug1' },
        { label: 'name2', value: 'slug2' },
      ],
    });
    expect(commonMock.getRepositoryTeams).toHaveBeenCalledTimes(1);
    expect(commonMock.getRepositoryTeams).toHaveBeenCalledWith(
      'some owner',
      'some repo',
      auth,
    );
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
