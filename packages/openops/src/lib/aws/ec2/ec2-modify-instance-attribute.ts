import * as EC2 from '@aws-sdk/client-ec2';
import { AwsCredentials } from '../auth';
import { getAwsClient } from '../get-client';
import { getInstanceState } from './ec2-instance-state-manager';

interface ModifyEc2InstanceParams {
  credentials: AwsCredentials;
  instanceId: string;
  region: string;
  dryRun: boolean;
  newConfiguration: Record<string, any>;
}

export async function ec2ModifyInstanceAttribute(
  params: ModifyEc2InstanceParams,
) {
  const ec2 = getAwsClient(
    EC2.EC2,
    params.credentials,
    params.region,
  ) as EC2.EC2;

  const results = [];
  try {
    const currentState = await getInstanceState(
      ec2,
      params.instanceId,
      params.dryRun,
    );

    if (currentState?.Name === EC2.InstanceStateName.running) {
      throw new Error('Instance must be stopped before modifying attributes');
    }

    for (const [key, value] of Object.entries(params.newConfiguration)) {
      if (value !== undefined) {
        results.push(
          await modifyInstanceAttribute(
            ec2,
            params.instanceId,
            { [key]: { Value: value } },
            params.dryRun,
          ),
        );
      }
    }
  } catch (error: any) {
    throw new Error(
      `Failure while modifying instance attribute with message: ${error?.message}`,
    );
  }

  return results;
}

async function modifyInstanceAttribute(
  ec2: EC2.EC2,
  instanceId: string,
  attributeToChange: any,
  dryRun: boolean,
) {
  return await ec2.modifyInstanceAttribute({
    InstanceId: instanceId,
    ...attributeToChange,
    DryRun: dryRun,
  });
}
