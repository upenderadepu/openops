const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  initiateEc2InstanceTermination: jest.fn(),
  dryRunCheckBox: jest.fn().mockReturnValue({
    required: false,
    defaultValue: false,
    type: 'CHECKBOX',
  }),
};

jest.mock('@openops/common', () => openopsCommonMock);

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

import { ec2TerminateInstancesAction } from '../../src/lib/actions/ec2/ec2-terminate-instances-action';

describe('ec2TerminateInstancesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct propeties', () => {
    expect(ec2TerminateInstancesAction.props).toMatchObject({
      instanceARNs: {
        required: true,
        type: 'ARRAY',
        displayName: 'Instance ARNs',
      },
      dryRun: {
        required: false,
        defaultValue: false,
        type: 'CHECKBOX',
      },
    });
  });

  test('should make a call per account and region', async () => {
    const arns = [
      'arn:aws:ec2:us-east-1:account1:instance/i-1',
      'arn:aws:ec2:us-east-1:account1:instance/i-2',
      'arn:aws:ec2:us-east-2:account1:instance/i-3',
      'arn:aws:ec2:us-east-2:account2:instance/i-4',
    ];

    openopsCommonMock.initiateEc2InstanceTermination.mockImplementation(
      (auth: any, region: any, instanceIds: string[], dryRun: any) => {
        return Promise.resolve(instanceIds);
      },
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        instanceARNs: arns,
        dryRun: true,
      },
    };

    const result = (await ec2TerminateInstancesAction.run(context)) as any;
    expect(result).toEqual(['i-1', 'i-2', 'i-3', 'i-4']);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(2);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      'account1',
    );
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      'account2',
    );
    expect(
      openopsCommonMock.initiateEc2InstanceTermination,
    ).toHaveBeenCalledTimes(3);
    expect(
      openopsCommonMock.initiateEc2InstanceTermination,
    ).toHaveBeenCalledWith(auth, 'us-east-1', ['i-1', 'i-2'], true);
    expect(
      openopsCommonMock.initiateEc2InstanceTermination,
    ).toHaveBeenCalledWith(auth, 'us-east-2', ['i-3'], true);
    expect(
      openopsCommonMock.initiateEc2InstanceTermination,
    ).toHaveBeenCalledWith(auth, 'us-east-2', ['i-4'], true);
  });

  test('should throw error when getEc2Instances throws error', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        instanceARNs: ['arn:aws:ec2:us-east-1:account1:instance/i-1'],
        dryRun: true,
      },
    };

    openopsCommonMock.initiateEc2InstanceTermination.mockRejectedValue(
      new Error('mockError'),
    );

    await expect(ec2TerminateInstancesAction.run(context)).rejects.toThrow(
      'An error occurred while terminating EC2 Instances: Error: mockError',
    );

    expect(
      openopsCommonMock.initiateEc2InstanceTermination,
    ).toHaveBeenCalledTimes(1);
  });
});
