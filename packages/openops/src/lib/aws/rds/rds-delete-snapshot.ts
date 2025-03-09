import * as RDS from '@aws-sdk/client-rds';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';
import { describeRdsSnapshots } from './rds-describe';

export async function initiateRdsSnapshotDeletion(
  credentials: AwsCredentials,
  region: string,
  snapshotId: string,
  waitForInSeconds?: number,
) {
  const client = getAwsClient(RDS.RDS, credentials, region) as RDS.RDS;
  try {
    const command = new RDS.DeleteDBSnapshotCommand({
      DBSnapshotIdentifier: snapshotId,
    });

    const initiateDeletion = await client.send(command);

    if (waitForInSeconds) {
      await waitForConditionWithTimeout(
        async () => {
          const filters = [{ Name: 'db-snapshot-id', Values: [snapshotId] }];
          const snapshots = await describeRdsSnapshots(
            credentials,
            [region],
            filters,
          );
          return !snapshots.length;
        },
        waitForInSeconds,
        2000,
        `Snapshot deletion timed out`,
      );
    }

    return initiateDeletion;
  } catch (error: any) {
    throw new Error('Delete RDS Snapshot failed with error: ' + error.message);
  }
}
