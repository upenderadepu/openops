import * as EC2 from '@aws-sdk/client-ec2';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';

export async function initiateEc2InstanceTermination(
  credentials: AwsCredentials,
  region: string,
  instanceIds: string[],
  dryRun: boolean,
) {
  const ec2 = getAwsClient(EC2.EC2, credentials, region) as EC2.EC2;

  const result = await ec2.terminateInstances({
    InstanceIds: instanceIds,
    DryRun: dryRun,
  });

  return result;
}
