const describeVolumesModificationsMock = jest.fn();
const modifyVolumeMock = jest.fn();

const getAwsClientMock = {
  getAwsClient: jest.fn().mockImplementation(() => ({
    modifyVolume: modifyVolumeMock,
    describeVolumesModifications: describeVolumesModificationsMock,
  })),
};

jest.mock('../../../src/lib/aws/get-client', () => getAwsClientMock);

const waitForMock = jest.fn();

jest.mock('../../../src/lib/condition-watcher', () => {
  return {
    waitForConditionWithTimeout: waitForMock,
  };
});

import { VolumeConfiguration } from '@aws-sdk/client-compute-optimizer';
import * as EC2Client from '@aws-sdk/client-ec2';
import { faker } from '@faker-js/faker';
import { modifyEbsVolume } from '../../../src/lib/aws/ebs/modify-ebs-volume';

const credentials = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('modifyEbsVolume', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    waitForMock.mockImplementationOnce(async (func: any) => {
      return Promise.resolve(await func());
    });
  });

  test(`should not query volume modification states if waitFor timespan is not passed`, async () => {
    modifyVolumeMock.mockResolvedValue({
      VolumeModification: {
        ModificationState: EC2Client.VolumeModificationState.completed,
      },
    });

    await modifyEbsVolume({
      credentials,
      dryRun: false,
      volumeId: '1',
      region: '2',
      newConfiguration: getVolumeConfigurationMock(),
    });

    expect(modifyVolumeMock).toHaveBeenCalledTimes(1);
    expect(describeVolumesModificationsMock).not.toHaveBeenCalled();
    expect(waitForMock).not.toHaveBeenCalled();
  });

  test(`should query volume modification states if waitFor timespan is passed`, async () => {
    modifyVolumeMock.mockResolvedValueOnce({
      VolumeModification: {
        ModificationState: EC2Client.VolumeModificationState.modifying,
      },
    });

    describeVolumesModificationsMock.mockResolvedValueOnce({
      VolumesModifications: [
        { ModificationState: EC2Client.VolumeModificationState.modifying },
      ],
    });

    await modifyEbsVolume({
      credentials,
      dryRun: false,
      volumeId: '1',
      region: '2',
      newConfiguration: getVolumeConfigurationMock(),
      waitForInSeconds: 1,
    });

    expect(modifyVolumeMock).toHaveBeenCalledTimes(1);
    expect(describeVolumesModificationsMock).toHaveBeenCalledTimes(1);
    expect(waitForMock).toHaveBeenCalledTimes(1);
    expect(waitForMock).toHaveBeenCalledWith(
      expect.any(Function),
      1,
      2000,
      'Volume modification timed out',
    );
  });

  test(`should throw when modify volume status is failed`, async () => {
    modifyVolumeMock.mockResolvedValue({
      VolumeModification: {
        ModificationState: EC2Client.VolumeModificationState.failed,
        StatusMessage: 'You do not have enough permissions',
      },
    });

    await expect(
      modifyEbsVolume({
        credentials,
        dryRun: false,
        volumeId: '1',
        region: '2',
        newConfiguration: getVolumeConfigurationMock(),
      }),
    ).rejects.toThrow(
      'Failed to modify volume 1: You do not have enough permissions',
    );
    expect(modifyVolumeMock).toHaveBeenCalledTimes(1);
    expect(describeVolumesModificationsMock).not.toHaveBeenCalled();
  });

  test(`should fail to modify the volume if received the failed state from describeVolumesModifications`, async () => {
    modifyVolumeMock.mockResolvedValueOnce({
      VolumeModification: {
        ModificationState: EC2Client.VolumeModificationState.modifying,
      },
    });

    describeVolumesModificationsMock.mockResolvedValueOnce({
      VolumesModifications: [
        {
          ModificationState: EC2Client.VolumeModificationState.failed,
          StatusMessage: 'An unknown error occurred',
        },
      ],
    });

    await expect(
      modifyEbsVolume({
        credentials,
        dryRun: false,
        volumeId: '1',
        region: '2',
        newConfiguration: getVolumeConfigurationMock(),
        waitForInSeconds: 1,
      }),
    ).rejects.toThrow('Failed to modify volume 1: An unknown error occurred');

    expect(modifyVolumeMock).toHaveBeenCalledTimes(1);
    expect(describeVolumesModificationsMock).toHaveBeenCalledTimes(1);
  });

  test.each([true, false])(
    `should call modifyVolume with given dryRun`,
    async (dryRun: boolean) => {
      modifyVolumeMock.mockResolvedValue({
        VolumeModification: {
          ModificationState: EC2Client.VolumeModificationState.completed,
        },
      });

      const newConfiguration = getVolumeConfigurationMock();
      const result = await modifyEbsVolume({
        credentials,
        dryRun,
        volumeId: '1',
        region: '2',
        newConfiguration,
      });

      expect(result).toEqual('Volume 1 was successfully modified');
      expect(modifyVolumeMock).toHaveBeenCalledTimes(1);
      expect(modifyVolumeMock).toHaveBeenCalledWith({
        Iops: newConfiguration.volumeBaselineIOPS,
        Size: newConfiguration.volumeSize,
        Throughput: newConfiguration.volumeBaselineThroughput,
        VolumeId: '1',
        VolumeType: newConfiguration.volumeType,
        DryRun: dryRun,
      });
      expect(describeVolumesModificationsMock).toHaveBeenCalledTimes(0);
    },
  );
});

const getVolumeConfigurationDefaults = (): VolumeConfiguration => {
  return {
    volumeSize: faker.number.int(),
    volumeBaselineIOPS: faker.number.int(),
    volumeBaselineThroughput: faker.number.int(),
    volumeType: faker.helpers.enumValue(EC2Client.VolumeType),
  };
};

export const getVolumeConfigurationMock = (
  p?: Partial<VolumeConfiguration>,
): VolumeConfiguration => ({
  ...getVolumeConfigurationDefaults(),
  ...p,
});
