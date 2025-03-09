const awsCliMock = {
  runCommand: jest.fn(),
};

const openOpsMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
};

jest.mock('@openops/common', () => openOpsMock);
jest.mock('../../src/lib/actions/cli/aws-cli', () => awsCliMock);

import { awsCliAction } from '../../src/lib/actions/cli/aws-cli-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some region',
};

describe('awsCliAction single account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openOpsMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(awsCliAction.props).toMatchObject({
      commandToRun: {
        type: 'LONG_TEXT',
        required: true,
      },
      dryRun: {
        type: 'CHECKBOX',
        required: false,
      },
    });
  });

  test('should return a parsed json object when the response is a json string', async () => {
    awsCliMock.runCommand.mockResolvedValue(
      '{"Owner":{"ID":"d15afcf7680d"},"Buckets":[{"Name":"bucket name","CreationDate":"2024-10-18T03:41:16+00:00"}]}',
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,

      propsValue: {
        commandToRun: 'aws s3api list-buckets --output json',
        account: { accounts: 'account' },
      },
    };

    const result = await awsCliAction.run(context);

    expect(result).toStrictEqual({
      Owner: { ID: 'd15afcf7680d' },
      Buckets: [
        { Name: 'bucket name', CreationDate: '2024-10-18T03:41:16+00:00' },
      ],
    });
    expect(openOpsMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(awsCliMock.runCommand).toHaveBeenCalledTimes(1);
    expect(awsCliMock.runCommand).toHaveBeenCalledWith(
      'aws s3api list-buckets --output json',
      auth.defaultRegion,
      auth,
    );
  });

  test('should return the output as-is when the response is not a valid json', async () => {
    awsCliMock.runCommand.mockResolvedValue('something here');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        commandToRun: 'aws s3api list-buckets --output json',
        account: { accounts: 'account' },
      },
    };

    const result = await awsCliAction.run(context);

    expect(result).toStrictEqual('something here');
    expect(awsCliMock.runCommand).toHaveBeenCalledTimes(1);
    expect(awsCliMock.runCommand).toHaveBeenCalledWith(
      'aws s3api list-buckets --output json',
      auth.defaultRegion,
      auth,
    );
  });

  test('should throw an error if runCommand fails', async () => {
    awsCliMock.runCommand.mockRejectedValue('error');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        commandToRun: 'aws s3api list-buckets --output json',
        account: { accounts: 'account' },
      },
    };

    await expect(awsCliAction.run(context)).rejects.toThrow(
      'An error occurred while running an AWS CLI command: error',
    );
    expect(awsCliMock.runCommand).toHaveBeenCalledTimes(1);
    expect(awsCliMock.runCommand).toHaveBeenCalledWith(
      'aws s3api list-buckets --output json',
      auth.defaultRegion,
      auth,
    );
  });

  test('should skip the execution when dry run is active', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        commandToRun: 'aws s3api list-buckets --output json',
        account: { accounts: 'account' },
        dryRun: true,
      },
    };

    const result = await awsCliAction.run(context);
    expect(result).toEqual(
      "Step execution skipped, dry run flag enabled. AWS CLI command will not be executed. Command: 'aws s3api list-buckets --output json'",
    );

    expect(awsCliMock.runCommand).not.toHaveBeenCalled();
  });
});
