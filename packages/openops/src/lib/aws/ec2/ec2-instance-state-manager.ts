import * as EC2 from '@aws-sdk/client-ec2';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { getAwsClient } from '../get-client';

export async function stopInstance(
  credentials: any,
  instanceId: string,
  region: string,
  dryRun: boolean,
  waitForStateChange: any,
) {
  const ec2 = getAwsClient(EC2.EC2, credentials, region) as EC2.EC2;

  const stopInstanceResult = await ec2.stopInstances({
    InstanceIds: [instanceId],
    DryRun: dryRun,
  });
  if (waitForStateChange) {
    await waitForInstanceToChangeState(
      ec2,
      instanceId,
      EC2.InstanceStateName.stopped,
      dryRun,
      waitForStateChange,
    );
  }

  return stopInstanceResult;
}

export async function startInstance(
  credentials: any,
  instanceId: string,
  region: string,
  dryRun: boolean,
  waitForStateChange: any,
) {
  const ec2 = getAwsClient(EC2.EC2, credentials, region) as EC2.EC2;

  const startInstanceResult = await ec2.startInstances({
    InstanceIds: [instanceId],
    DryRun: dryRun,
  });

  if (waitForStateChange) {
    await waitForInstanceToChangeState(
      ec2,
      instanceId,
      EC2.InstanceStateName.running,
      dryRun,
      waitForStateChange,
    );
  }

  return startInstanceResult;
}

export async function getInstanceState(
  ec2: EC2.EC2,
  instanceId: string,
  dryRun: boolean,
): Promise<EC2.InstanceState | undefined> {
  const instanceStatus = await ec2.describeInstanceStatus({
    InstanceIds: [instanceId],
    IncludeAllInstances: true,
    DryRun: dryRun,
  });
  return instanceStatus.InstanceStatuses?.[0]?.InstanceState;
}

async function waitForInstanceToChangeState(
  ec2: EC2.EC2,
  instanceId: string,
  desiredState: EC2.InstanceStateName,
  dryRun: boolean,
  waitForTime: number,
) {
  try {
    await waitForConditionWithTimeout(
      async () => {
        const instanceState = await getInstanceState(ec2, instanceId, dryRun);
        return instanceState?.Name === desiredState;
      },
      300,
      waitForTime,
      `Instance state change to ${desiredState}`,
    );
  } catch (error: any) {
    throw new Error(
      `Failure while waiting for instance to change state: ${error?.message}`,
    );
  }
}
