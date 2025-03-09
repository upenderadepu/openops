const commonMock = {
  ...jest.requireActual('../src/lib/common/github-api'),
  getUserRepo: jest.fn(),
};

jest.mock('../src/lib/common/github-api', () => commonMock);

import { getRepositoryProperty } from '../src/lib/common/repository-property';

const auth = {
  access_token: 'some access token',
};

describe('Get Repository Property', () => {
  test('should return expected properties', async () => {
    const result = getRepositoryProperty();

    expect(result).toMatchObject({
      displayName: 'Repository',
      type: 'DROPDOWN',
      required: true,
    });
  });

  test('should return empty if not authenticated', async () => {
    const property = getRepositoryProperty();
    const context = createContext();

    const result = await property.options({ auth: undefined }, context);

    expect(result).toMatchObject({
      disabled: true,
      options: [],
      placeholder: 'Please authenticate first',
    });
    expect(commonMock.getUserRepo).not.toHaveBeenCalled();
  });

  test('should return dropdown', async () => {
    commonMock.getUserRepo.mockResolvedValue([
      { name: 'repo1', owner: { login: 'owner1' } },
      { name: 'repo2', owner: { login: 'owner2' } },
    ]);

    const property = getRepositoryProperty();
    const context = createContext();

    const result = await property.options({ auth: auth }, context);

    expect(result).toMatchObject({
      disabled: false,
      options: [
        { label: 'owner1/repo1', value: { owner: 'owner1', repo: 'repo1' } },
        { label: 'owner2/repo2', value: { owner: 'owner2', repo: 'repo2' } },
      ],
    });
    expect(commonMock.getUserRepo).toHaveBeenCalledTimes(1);
    expect(commonMock.getUserRepo).toHaveBeenCalledWith(auth);
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
