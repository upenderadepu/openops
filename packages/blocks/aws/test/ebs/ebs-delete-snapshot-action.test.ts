const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  deleteEbsSnapshot: jest.fn(),
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

import { ebsDeleteSnapshotAction } from '../../src/lib/actions/ebs/ebs-delete-snapshot-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('ebsDeleteSnapshotAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(ebsDeleteSnapshotAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
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
    openopsCommonMock.deleteEbsSnapshot.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await ebsDeleteSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when deleteEbsSnapshot throws error', async () => {
    openopsCommonMock.deleteEbsSnapshot.mockRejectedValue('error');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
        shouldWaitForCreation: false,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(ebsDeleteSnapshotAction.run(context)).rejects.toThrow(
      'An error occurred while deleting the EBS Snapshot: error',
    );
  });

  test('should call ebsDeleteSnapshotAction with given input', async () => {
    openopsCommonMock.deleteEbsSnapshot.mockResolvedValue('mockResult');

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

    const result = (await ebsDeleteSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.deleteEbsSnapshot).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.deleteEbsSnapshot).toHaveBeenCalledWith(
      auth,
      'us-west-2',
      'someVolumeId',
      false,
      10,
    );
  });
});
