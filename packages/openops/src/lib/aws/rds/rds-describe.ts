import * as RDS from '@aws-sdk/client-rds';
import { getAwsClient } from '../get-client';

export async function describeRdsSnapshots(
  credentials: any,
  regions: [string, ...string[]],
  filters?: RDS.Filter[] | undefined,
): Promise<RDS.DBSnapshot[]> {
  const fetchSnapshotsInRegion = async (region: string): Promise<any[]> => {
    const client = getAwsClient(RDS.RDS, credentials, region) as RDS.RDS;

    const command = new RDS.DescribeDBSnapshotsCommand({
      Filters: filters,
    });

    const response = await client.send(command);

    return (
      response.DBSnapshots?.map((snapshot) => ({
        ...snapshot,
        region,
      })) || []
    );
  };

  const snapshotsFromAllRegions = await Promise.all(
    regions.map(fetchSnapshotsInRegion),
  );
  return snapshotsFromAllRegions.flat();
}

export async function describeRdsInstances(
  credentials: any,
  regions: [string, ...string[]],
  filters?: RDS.Filter[] | undefined,
): Promise<RDS.DBInstance[]> {
  const fetchInstancesInRegion = async (region: string): Promise<any[]> => {
    const client = getAwsClient(RDS.RDS, credentials, region) as RDS.RDS;

    const command = new RDS.DescribeDBInstancesCommand({
      Filters: filters,
    });

    const response = await client.send(command);

    return (
      response.DBInstances?.map((instance) => ({
        ...instance,
        region,
      })) || []
    );
  };

  const instancesFromAllRegions = await Promise.all(
    regions.map(fetchInstancesInRegion),
  );
  return instancesFromAllRegions.flat();
}
