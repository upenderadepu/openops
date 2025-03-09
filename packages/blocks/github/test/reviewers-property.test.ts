const commonMock = {
  ...jest.requireActual('../src/lib/common/github-api'),
  getCollaborators: jest.fn(),
};

jest.mock('../src/lib/common/github-api', () => commonMock);

import { getReviewersProperty } from '../src/lib/common/reviewers-property';

const auth = {
  access_token: 'some access token',
};

describe('Get Reviewers Property', () => {
  test('should return expected properties', async () => {
    const result = getReviewersProperty();

    expect(result).toMatchObject({
      displayName: 'Reviewers',
      type: 'MULTI_SELECT_DROPDOWN',
      required: false,
    });
  });

  test('should return empty if repository is undefined', async () => {
    const property = getReviewersProperty();
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

    expect(commonMock.getCollaborators).not.toHaveBeenCalled();
  });

  test('should return dropdown', async () => {
    commonMock.getCollaborators.mockResolvedValue([
      { login: 'login1', id: 1 },
      { login: 'login2', id: 2 },
    ]);

    const property = getReviewersProperty();
    const context = createContext();

    const result = await property.options(
      { auth: auth, repository: { owner: 'some owner', repo: 'some repo' } },
      context,
    );

    expect(result).toMatchObject({
      disabled: false,
      options: [
        { label: 'login1', value: 'login1' },
        { label: 'login2', value: 'login2' },
      ],
    });
    expect(commonMock.getCollaborators).toHaveBeenCalledTimes(1);
    expect(commonMock.getCollaborators).toHaveBeenCalledWith(
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
