import {
  AssumeRoleCommand,
  Credentials,
  GetCallerIdentityCommand,
  STSClient,
} from '@aws-sdk/client-sts';
import { v4 as uuidv4 } from 'uuid';

function getSTSClient(
  accessKeyId: string,
  secretAccessKey: string,
  defaultRegion: string,
  sessionToken?: string,
  endpoint?: string,
): STSClient {
  const auth = {
    region: defaultRegion,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
    },
    endpoint: endpoint,
  };

  return new STSClient(auth);
}

export async function getAccountId(
  credentials: any,
  defaultRegion: string,
): Promise<string> {
  const client = getSTSClient(
    credentials.accessKeyId,
    credentials.secretAccessKey,
    defaultRegion,
    credentials.sessionToken,
    credentials.endpoint,
  );
  const command = new GetCallerIdentityCommand({});
  const response = await client.send(command);

  return response.Account ?? '';
}

export async function assumeRole(
  accessKeyId: string,
  secretAccessKey: string,
  defaultRegion: string,
  roleArn: string,
  externalId?: string,
): Promise<Credentials | undefined> {
  const client = getSTSClient(accessKeyId, secretAccessKey, defaultRegion);
  const command = new AssumeRoleCommand({
    RoleArn: roleArn,
    ExternalId: externalId || undefined,
    RoleSessionName: 'openops-' + uuidv4(),
  });
  const response = await client.send(command);

  return response.Credentials;
}
