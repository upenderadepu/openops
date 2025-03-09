import * as EC2 from '@aws-sdk/client-ec2';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';

export async function deleteEbsSnapshot(
  credentials: AwsCredentials,
  region: string,
  resourceId: string,
  dryRun: boolean,
  waitForInSeconds?: number,
) {
  const ec2 = getAwsClient(EC2.EC2, credentials, region) as EC2.EC2;
  const snapshotParams: EC2.DeleteSnapshotRequest = {
    SnapshotId: resourceId,
    DryRun: dryRun,
  };
  await ec2.deleteSnapshot(snapshotParams);

  if (waitForInSeconds) {
    await waitForConditionWithTimeout(
      () => checkSnapshotStatus(ec2, resourceId, dryRun),
      waitForInSeconds,
      2000,
      `Snapshot deletion timed out`,
    );
    return { snapshotId: resourceId, message: 'Snapshot deleted' };
  }

  return {
    snapshotId: resourceId,
    message: 'Snapshot deletion being processed',
  };
}

async function checkSnapshotStatus(
  ec2: EC2.EC2,
  resourceId: string,
  dryRun: boolean,
): Promise<boolean> {
  let snapshotStatusResult: EC2.DescribeSnapshotsResult = {};

  try {
    snapshotStatusResult = await ec2.describeSnapshots({
      SnapshotIds: [resourceId],
      DryRun: dryRun,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'InvalidSnapshot.NotFound') {
      return true;
    }
    throw new Error(`Snapshot deletion failed with error: ${error}`);
  }

  if (
    snapshotStatusResult.Snapshots &&
    snapshotStatusResult.Snapshots?.length === 0
  ) {
    return true;
  }

  const snapshotStatus = snapshotStatusResult.Snapshots?.[0].State;

  if (snapshotStatus === EC2.SnapshotState.error) {
    throw new Error(
      `Snapshot deletion failed with error: ${snapshotStatusResult.Snapshots?.[0].StateMessage}`,
    );
  }

  return snapshotStatus === EC2.SnapshotState.completed;
}
