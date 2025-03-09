const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  deleteEbsVolume: jest.fn(),
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

import { ebsDeleteVolumeAction } from '../../src/lib/actions/ebs/ebs-delete-volume-action';

describe('ebsDeleteVolumeAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(ebsDeleteVolumeAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      dryRun: {
        required: false,
        defaultValue: false,
        type: 'CHECKBOX',
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.deleteEbsVolume.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-west-2:123456789012:volume/someVolumeId',
      },
    };

    const result = (await ebsDeleteVolumeAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when deleteEbsVolume throws error', async () => {
    openopsCommonMock.deleteEbsVolume.mockRejectedValue('mockError');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-east-1:123456789012:volume/vol-1234567890abcdef0',
        dryRun: false,
      },
    };

    await expect(ebsDeleteVolumeAction.run(context)).rejects.toThrow(
      'An error occurred while deleting EBS Volume: mockError',
    );
  });

  test('should call deleteEbsVolume with the correct params', async () => {
    openopsCommonMock.deleteEbsVolume.mockResolvedValue('mockResult');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:ec2:us-east-1:123456789012:volume/vol-1234567890abcdef0',
        dryRun: true,
      },
    };

    const result = (await ebsDeleteVolumeAction.run(context)) as any;
    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.deleteEbsVolume).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.deleteEbsVolume).toHaveBeenCalledWith(
      auth,
      'us-east-1',
      'vol-1234567890abcdef0',
      true,
    );
  });
});
