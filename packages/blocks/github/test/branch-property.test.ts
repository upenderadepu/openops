const commonMock = {
  ...jest.requireActual('../src/lib/common/github-api'),
  listBranches: jest.fn(),
};

jest.mock('../src/lib/common/github-api', () => commonMock);

import { getBranchProperty } from '../src/lib/common/branch-property';

const auth = {
  access_token: 'some access token',
};

describe('Get Branch Property', () => {
  test('should return expected properties', async () => {
    const result = getBranchProperty();

    expect(result).toMatchObject({
      displayName: 'Branch',
      type: 'DROPDOWN',
      required: true,
    });
  });

  test('should return empty if repository is undefined', async () => {
    const property = getBranchProperty();
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

    expect(commonMock.listBranches).not.toHaveBeenCalled();
  });

  test('should return dropdown', async () => {
    commonMock.listBranches.mockResolvedValue([
      { name: 'branch1' },
      { name: 'branch2' },
    ]);

    const property = getBranchProperty();
    const context = createContext();

    const result = await property.options(
      { auth: auth, repository: { owner: 'some owner', repo: 'some repo' } },
      context,
    );

    expect(result).toMatchObject({
      disabled: false,
      options: [
        { label: 'branch1', value: 'branch1' },
        { label: 'branch2', value: 'branch2' },
      ],
    });
    expect(commonMock.listBranches).toHaveBeenCalledTimes(1);
    expect(commonMock.listBranches).toHaveBeenCalledWith(
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
