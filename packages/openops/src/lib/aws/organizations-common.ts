import {
  Account,
  DescribeAccountCommand,
  OrganizationsClient,
} from '@aws-sdk/client-organizations';

function getOrganizationsClient(
  accessKeyId: string,
  secretAccessKey: string,
  defaultRegion: string,
  sessionToken?: string,
  endpoint?: string,
): OrganizationsClient {
  const auth = {
    region: defaultRegion,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
    },
    endpoint: endpoint,
  };

  return new OrganizationsClient(auth);
}

export async function getAccountName(
  credentials: any,
  defaultRegion: string,
  accountId: string,
): Promise<string | undefined> {
  try {
    const account = await getAccountInformation(
      credentials,
      defaultRegion,
      accountId,
    );
    return account?.Name;
  } catch (error) {
    return undefined;
  }
}

export async function getAccountInformation(
  credentials: any,
  defaultRegion: string,
  accountId: string,
): Promise<Account | undefined> {
  const client = getOrganizationsClient(
    credentials.accessKeyId,
    credentials.secretAccessKey,
    defaultRegion,
    credentials.sessionToken,
    credentials.endpoint,
  );
  const command = new DescribeAccountCommand({ AccountId: accountId });

  const response = await client.send(command);
  return response.Account;
}
