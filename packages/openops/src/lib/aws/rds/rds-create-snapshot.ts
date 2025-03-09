import * as RDS from '@aws-sdk/client-rds';
import { Tag } from '@aws-sdk/client-rds';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';
import { describeRdsSnapshots } from './rds-describe';

interface CreateRDSSnapshotParams {
  credentials: AwsCredentials;
  region: string;
  dbInstanceId: string;
  snapshotId?: string | undefined | null;
  waitForInSeconds?: number;
  tags?: Record<string, unknown> | undefined | null;
}

export async function initiateRdsSnapshotCreation(
  params: CreateRDSSnapshotParams,
) {
  const client = getAwsClient(
    RDS.RDS,
    params.credentials,
    params.region,
  ) as RDS.RDS;
  const newSnapshotId = params.snapshotId
    ? params.snapshotId
    : params.dbInstanceId + '-' + Date.now();
  try {
    const tags = params.tags ? recordTagsArray(params.tags) : [];

    const command = new RDS.CreateDBSnapshotCommand({
      DBInstanceIdentifier: params.dbInstanceId,
      DBSnapshotIdentifier: newSnapshotId,
      Tags: tags.length ? tags : undefined,
    });

    const initiateCreation = await client.send(command);

    if (!params.waitForInSeconds) {
      return initiateCreation;
    }

    await waitForConditionWithTimeout(
      async () => {
        const filters = [{ Name: 'db-snapshot-id', Values: [newSnapshotId] }];
        const snapshots = await describeRdsSnapshots(
          params.credentials,
          [params.region],
          filters,
        );
        return snapshots.length === 1 && snapshots[0].Status === 'available';
      },
      params.waitForInSeconds,
      2000,
      `Snapshot creation timed out`,
    );

    return initiateCreation;
  } catch (error: any) {
    throw new Error('Create RDS Snapshot failed with error: ' + error.message);
  }
}

function recordTagsArray(record: Record<string, unknown>): Tag[] {
  return Object.entries(record).map(([key, value]) => ({
    Key: key,
    Value: value,
  })) as Tag[];
}
