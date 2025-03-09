const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  stopInstance: jest.fn(),
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

import { ec2StopInstanceAction } from '../../src/lib/actions/ec2/ec2-stop-instance-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('ec2StopInstanceAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(
      'new credentials',
    );
  });

  test('should create action with correct properties', () => {
    expect(ec2StopInstanceAction.props).toMatchObject({
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
    openopsCommonMock.stopInstance.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await ec2StopInstanceAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when stopInstance throws error', async () => {
    openopsCommonMock.stopInstance.mockRejectedValue(new Error('mockError'));

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/someInstanceId',
        dryRun: true,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(ec2StopInstanceAction.run(context)).rejects.toThrow(
      'mockError',
    );
  });

  test('should call stopInstance with given input', async () => {
    openopsCommonMock.stopInstance.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:instance/someInstanceId',
        dryRun: true,
        waitForTimeInSecondsProperty: { waitForTimeInSeconds: 10 },
      },
    };

    const result = (await ec2StopInstanceAction.run(context)) as any;

    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.stopInstance).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.stopInstance).toHaveBeenCalledWith(
      'new credentials',
      'someInstanceId',
      'us-west-2',
      true,
      10,
    );
  });
});
