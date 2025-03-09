import { runCliCommand } from '@openops/common';

export async function runCommand(
  command: string,
  region: string,
  credentials: any,
): Promise<string> {
  const envVars = {
    AWS_ACCESS_KEY_ID: credentials.accessKeyId,
    AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
    AWS_SESSION_TOKEN: credentials.sessionToken,
    AWS_DEFAULT_REGION: region,
    PATH: process.env['PATH'] ?? '',
  };

  return await runCliCommand(command, 'aws', envVars);
}
