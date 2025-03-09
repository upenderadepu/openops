const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  startInstance: jest.fn(),
  waitForProperties: jest.fn().mockReturnValue({
    shouldWaitForCreation: {
      required: true,
      type: 'CHECKBOX',
      displayName: 'Should wait for Operation to Complete',
    },
    waitForDynamicProp: {},
  }),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { ec2StartInstanceAction } from '../../src/lib/actions/ec2/ec2-start-instance-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('ec2StartInstanceAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(
      'new credentials',
    );
  });

  test('should create action with correct properties', () => {
    expect(ec2StartInstanceAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      dryRun: {
        required: false,
        type: 'CHECKBOX',
      },
      shouldWaitForCreation: {
        type: 'CHECKBOX',
        required: true,
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.startInstance.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await ec2StartInstanceAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when startInstance throws error', async () => {
    openopsCommonMock.startInstance.mockRejectedValue(new Error('mockError'));

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/someInstanceId',
        dryRun: true,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(ec2StartInstanceAction.run(context)).rejects.toThrow(
      'mockError',
    );
  });

  test('should call startInstance with given input', async () => {
    openopsCommonMock.startInstance.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/someInstanceId',
        dryRun: true,
        waitForTimeInSecondsProperty: { waitForTimeInSeconds: 10 },
      },
    };

    const result = (await ec2StartInstanceAction.run(context)) as any;

    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.startInstance).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.startInstance).toHaveBeenCalledWith(
      'new credentials',
      'someInstanceId',
      'us-west-2',
      true,
      10,
    );
  });
});
