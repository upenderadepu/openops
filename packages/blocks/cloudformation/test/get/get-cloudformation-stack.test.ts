const getCloudFormationTemplateMock = {
  getCloudFormationTemplate: jest.fn(),
};

const commonMock = {
  ...jest.requireActual('@openops/common'),
  parseArn: jest.fn(),
  getCredentialsForAccount: jest.fn(),
};

jest.mock('../../src/lib/get-template', () => getCloudFormationTemplateMock);
jest.mock('@openops/common', () => commonMock);

import { getStack } from '../../src/lib/get/get-stack';

describe('Get Cloudformation Template', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create action with correct properties', () => {
    expect(Object.keys(getStack.props).length).toBe(1);
    expect(getStack.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
    });
  });

  test('should use mandatory properties', async () => {
    getCloudFormationTemplateMock.getCloudFormationTemplate.mockResolvedValue(
      'mockResult',
    );
    commonMock.parseArn.mockReturnValue({
      region: 'region',
      accountId: 'account id',
    });
    commonMock.getCredentialsForAccount.mockResolvedValue({});

    const context = createContext({
      arn: 'arn',
    });

    const result = (await getStack.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(commonMock.parseArn).toHaveBeenCalledTimes(1);
    expect(commonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(
      getCloudFormationTemplateMock.getCloudFormationTemplate,
    ).toHaveBeenCalledTimes(1);
    expect(
      getCloudFormationTemplateMock.getCloudFormationTemplate,
    ).toHaveBeenCalledWith({}, 'region', 'arn');
  });

  test('should throw error when request fails', async () => {
    getCloudFormationTemplateMock.getCloudFormationTemplate.mockRejectedValue(
      new Error('mockError'),
    );
    commonMock.parseArn.mockReturnValue({
      region: 'region',
      accountId: 'account id',
    });
    commonMock.getCredentialsForAccount.mockResolvedValue({});

    const context = createContext({
      arn: 'arn',
    });

    await expect(getStack.run(context)).rejects.toThrow(
      'An error occurred while fetching cloudformation stack:',
    );

    expect(commonMock.parseArn).toHaveBeenCalledTimes(1);
    expect(commonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(
      getCloudFormationTemplateMock.getCloudFormationTemplate,
    ).toHaveBeenCalledTimes(1);
    expect(
      getCloudFormationTemplateMock.getCloudFormationTemplate,
    ).toHaveBeenCalledWith({}, 'region', 'arn');
  });

  function createContext(props: unknown) {
    return {
      ...jest.requireActual('@openops/blocks-framework'),
      propsValue: props,
    };
  }
});
