const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  createEbsSnapshot: jest.fn(),
  dryRunCheckBox: jest.fn().mockReturnValue({
    required: false,
    defaultValue: false,
    type: 'CHECKBOX',
  }),
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

import { ebsCreateSnapshotAction } from '../../src/lib/actions/ebs/ebs-create-snapshot-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('ebsCreateSnapshotAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(ebsCreateSnapshotAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      description: {
        type: 'LONG_TEXT',
        required: false,
      },
      shouldWaitForCreation: {
        type: 'CHECKBOX',
        required: true,
      },
      dryRun: {
        required: false,
        defaultValue: false,
        type: 'CHECKBOX',
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.createEbsSnapshot.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await ebsCreateSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when createEbsSnapshot throws error', async () => {
    openopsCommonMock.createEbsSnapshot.mockRejectedValue('mockError');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        shouldWaitForCreation: false,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(ebsCreateSnapshotAction.run(context)).rejects.toThrow(
      'An error occurred while creating the EBS Snapshot: mockError',
    );
  });

  test('should call ebsCreateSnapshotAction with given input', async () => {
    openopsCommonMock.createEbsSnapshot.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        shouldWaitForCreation: true,
        waitForTimeInSecondsProperty: { waitForTimeInSeconds: 10 },
        description: 'someDescription',
        dryRun: false,
      },
    };

    const result = (await ebsCreateSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.createEbsSnapshot).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.createEbsSnapshot).toHaveBeenCalledWith({
      credentials: auth,
      region: 'us-west-2',
      volumeId: 'someVolumeId',
      dryRun: false,
      description: 'someDescription',
      waitForInSeconds: 10,
    });
  });
});
