import * as EC2 from '@aws-sdk/client-ec2';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';

export async function deleteEbsVolume(
  credentials: AwsCredentials,
  region: string,
  volumeId: string,
  dryRun: boolean,
) {
  const ec2 = getAwsClient(EC2.EC2, credentials, region) as EC2.EC2;

  const params: EC2.DeleteVolumeRequest = {
    VolumeId: volumeId,
    DryRun: dryRun,
  };
  const response = await ec2.deleteVolume(params);

  return response;
}
