import { VolumeConfiguration } from '@aws-sdk/client-compute-optimizer';
import * as EC2Client from '@aws-sdk/client-ec2';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';

interface ModifyEbsVolumeParams {
  credentials: AwsCredentials;
  volumeId: string;
  region: string;
  waitForInSeconds?: number;
  dryRun: boolean;
  newConfiguration: VolumeConfiguration;
}

export async function modifyEbsVolume({
  credentials,
  region,
  dryRun,
  volumeId,
  newConfiguration,
  waitForInSeconds,
}: ModifyEbsVolumeParams) {
  const ec2 = getAwsClient(EC2Client.EC2, credentials, region) as EC2Client.EC2;

  const params: EC2Client.ModifyVolumeRequest = {
    DryRun: dryRun,
    VolumeId: volumeId,
    VolumeType:
      EC2Client.VolumeType[
        newConfiguration.volumeType as keyof typeof EC2Client.VolumeType
      ],
    Size: newConfiguration.volumeSize,
    Iops: newConfiguration.volumeBaselineIOPS,
    Throughput: newConfiguration.volumeBaselineThroughput,
  };

  const modificationResult = await ec2.modifyVolume(params);
  const modificationState =
    modificationResult.VolumeModification?.ModificationState;

  if (modificationState === EC2Client.VolumeModificationState.failed) {
    throw new Error(
      `Failed to modify volume ${volumeId}: ${modificationResult.VolumeModification?.StatusMessage}`,
    );
  }

  if (
    modificationState === EC2Client.VolumeModificationState.completed ||
    modificationState === EC2Client.VolumeModificationState.optimizing
  ) {
    return `Volume ${volumeId} was successfully modified`;
  }

  if (waitForInSeconds) {
    await waitForVolumeModification(ec2, volumeId, waitForInSeconds);
    return `Volume ${volumeId} was successfully modified`;
  }

  return `Volume ${volumeId} modification was initiated`;
}

function waitForVolumeModification(
  ec2: EC2Client.EC2,
  volumeId: string,
  waitForInSeconds: number,
): Promise<void> {
  return waitForConditionWithTimeout(
    async () => {
      const { VolumesModifications } = await ec2.describeVolumesModifications({
        VolumeIds: [volumeId],
      });
      const modification = VolumesModifications?.[0];
      const modificationState = modification?.ModificationState;

      if (modificationState === EC2Client.VolumeModificationState.failed) {
        throw new Error(
          `Failed to modify volume ${volumeId}: ${modification?.StatusMessage}`,
        );
      }

      return (
        modificationState === EC2Client.VolumeModificationState.completed ||
        modificationState === EC2Client.VolumeModificationState.optimizing
      );
    },
    waitForInSeconds,
    2000,
    `Volume modification timed out`,
  );
}
