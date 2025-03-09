const openOpsMock = {
  runCliCommand: jest.fn(),
};

jest.mock('@openops/common', () => openOpsMock);

import { runCommand } from '../../src/lib/actions/cli/aws-cli';

const credential = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  sessionToken: 'some token',
};

describe('awsCli', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call runCliCommand with the given arguments', async () => {
    openOpsMock.runCliCommand.mockResolvedValue('mock result');

    const result = await runCommand('some command', 'region', credential);

    expect(result).toBe('mock result');
    expect(openOpsMock.runCliCommand).toHaveBeenCalledWith(
      'some command',
      'aws',
      {
        AWS_ACCESS_KEY_ID: credential.accessKeyId,
        AWS_SECRET_ACCESS_KEY: credential.secretAccessKey,
        AWS_SESSION_TOKEN: credential.sessionToken,
        AWS_DEFAULT_REGION: 'region',
        PATH: process.env['PATH'],
      },
    );
  });
});
