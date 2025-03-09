import { AwsCredentials } from './auth';

export function getAwsClient<T>(
  ClientConstructor: new (config: {
    region: string;
    credentials: AwsCredentials;
    endpoint?: string;
  }) => T,
  credentials: AwsCredentials,
  region: string,
): T {
  return new ClientConstructor({
    region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
    endpoint: credentials.endpoint ? credentials.endpoint : undefined,
  });
}
