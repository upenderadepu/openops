const instanceStateManagerMock = {
  getInstanceState: jest.fn(),
};

const getClientMock = {
  getAwsClient: jest.fn(),
};

jest.mock('../../../src/lib/aws/get-client', () => getClientMock);
jest.mock(
  '../../../src/lib/aws/ec2/ec2-instance-state-manager',
  () => instanceStateManagerMock,
);

import * as EC2 from '@aws-sdk/client-ec2';
import { ec2ModifyInstanceAttribute } from '../../../src/lib/aws/ec2/ec2-modify-instance-attribute';

const CREDENTIALS = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  sessionToken: 'some sessionToken',
};

describe('ec2ModifyInstanceAttribute tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw if instance is not stopped', async () => {
    const mockedEC2 = {
      modifyInstanceAttribute: jest
        .fn()
        .mockImplementation((params: EC2.ModifyInstanceAttributeCommandInput) =>
          Promise.resolve(params),
        ),
    };
    getClientMock.getAwsClient.mockImplementation(() => mockedEC2);
    instanceStateManagerMock.getInstanceState.mockResolvedValue({
      Name: EC2.InstanceStateName.running,
    });

    await expect(
      ec2ModifyInstanceAttribute({
        credentials: CREDENTIALS,
        region: 'some region',
        instanceId: 'some instance id',
        newConfiguration: {},
        dryRun: false,
      }),
    ).rejects.toThrow('Instance must be stopped before modifying attributes');

    expect(instanceStateManagerMock.getInstanceState).toHaveBeenCalledTimes(1);
    expect(instanceStateManagerMock.getInstanceState).toHaveBeenCalledWith(
      mockedEC2,
      'some instance id',
      false,
    );
    expect(mockedEC2.modifyInstanceAttribute).not.toHaveBeenCalled();
  });

  test('should call with expected modifiers', async () => {
    const mockedEC2 = {
      modifyInstanceAttribute: jest
        .fn()
        .mockImplementation((params: EC2.ModifyInstanceAttributeCommandInput) =>
          Promise.resolve(params),
        ),
    };

    getClientMock.getAwsClient.mockImplementation(() => mockedEC2);
    instanceStateManagerMock.getInstanceState.mockResolvedValue({
      Name: EC2.InstanceStateName.stopped,
    });

    const result = await ec2ModifyInstanceAttribute({
      credentials: CREDENTIALS,
      region: 'some region',
      instanceId: 'some instance id',
      newConfiguration: {
        InstanceType: 'someInstanceType',
        EnaSupport: true,
        DisableApiStop: false,
      },
      dryRun: true,
    });

    expect(result).toStrictEqual([
      {
        DryRun: true,
        InstanceId: 'some instance id',
        InstanceType: { Value: 'someInstanceType' },
      },
      {
        DryRun: true,
        InstanceId: 'some instance id',
        EnaSupport: { Value: true },
      },
      {
        DryRun: true,
        InstanceId: 'some instance id',
        DisableApiStop: { Value: false },
      },
    ]);
    expect(mockedEC2.modifyInstanceAttribute).toHaveBeenCalledTimes(3);
  });
});
