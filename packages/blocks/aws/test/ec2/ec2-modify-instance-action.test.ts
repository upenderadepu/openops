const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  waitForProperties: jest.fn().mockReturnValue({
    shouldWaitForCreation: {
      required: true,
      type: 'CHECKBOX',
      displayName: 'Should wait for Operation to Complete',
    },
    waitForDynamicProp: {},
  }),
  ec2ModifyInstanceAttribute: jest.fn(),
};

jest.mock('@openops/common', () => openopsCommonMock);

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

import { ec2ModifyInstanceAction } from '../../src/lib/actions/ec2/ec2-modify-instance-action';

describe('ec2ModifyInstanceAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(ec2ModifyInstanceAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      modifiers: {
        required: true,
        type: 'DYNAMIC',
      },
      dryRun: {
        required: false,
        type: 'CHECKBOX',
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.ec2ModifyInstanceAttribute.mockResolvedValueOnce([
      'mockResult',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0',
        modifiers: {
          modifiers: [
            {
              attributeName: 'InstanceType',
              attributeValue: { attributeValue: 'some type 1' },
            },
          ],
        },
      },
    };

    const result = (await ec2ModifyInstanceAction.run(context)) as any;

    expect(result).toEqual(['mockResult']);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should call modify instance attribute with correct input', async () => {
    openopsCommonMock.ec2ModifyInstanceAttribute.mockResolvedValueOnce([
      'mockResult',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0',
        dryRun: true,
        modifiers: {
          modifiers: [
            {
              attributeName: 'InstanceType',
              attributeValue: { attributeValue: 'some type 1' },
            },
          ],
        },
      },
    };

    const result = (await ec2ModifyInstanceAction.run(context)) as any;
    expect(result).toEqual(['mockResult']);

    expect(openopsCommonMock.ec2ModifyInstanceAttribute).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.ec2ModifyInstanceAttribute).toHaveBeenCalledWith({
      instanceId: 'i-1234567890abcdef0',
      credentials: auth,
      region: 'us-west-2',
      newConfiguration: { InstanceType: 'some type 1' },
      dryRun: true,
    });
  });

  test('should throw an error if ec2ModifyInstanceAttribute fails', async () => {
    openopsCommonMock.ec2ModifyInstanceAttribute.mockRejectedValue(
      new Error('mock error'),
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/i-1234567890abcdef0',
        dryRun: true,
        modifiers: {
          modifiers: [
            {
              attributeName: 'InstanceType',
              attributeValue: { attributeValue: 'some type 1' },
            },
          ],
        },
      },
    };

    await expect(ec2ModifyInstanceAction.run(context)).rejects.toThrow(
      'An error occurred while modifying EC2 instance: Error: mock error',
    );
  });
});
