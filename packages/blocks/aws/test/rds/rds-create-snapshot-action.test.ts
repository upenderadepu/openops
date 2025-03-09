const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  initiateRdsSnapshotCreation: jest.fn(),
  waitForProperties: jest.fn().mockReturnValue({
    shouldWaitForCreation: {
      required: true,
      type: 'CHECKBOX',
      displayName: 'Should wait for Operation to Complete',
    },
    waitForDynamicProp: {},
  }),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { rdsCreateSnapshotAction } from '../../src/lib/actions/rds/rds-create-snapshot-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('rdsCreateSnapshotAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(rdsCreateSnapshotAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      snapshotId: {
        type: 'LONG_TEXT',
        required: false,
      },
      tags: {
        type: 'OBJECT',
        required: false,
      },
      shouldWaitForCreation: {
        type: 'CHECKBOX',
        required: true,
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.initiateRdsSnapshotCreation.mockResolvedValue(
      'mockResult',
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:rds:us-west-2:123456789012:db:mysql-db-instance1',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await rdsCreateSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when initiateRdsSnapshotCreation throws error', async () => {
    openopsCommonMock.initiateRdsSnapshotCreation.mockRejectedValue(
      new Error('mockError'),
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: `arn:aws:rds:us-west-2:123456789012:db:mysql-db-instance1`,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(rdsCreateSnapshotAction.run(context)).rejects.toThrow(
      'mockError',
    );
  });

  test('should call initiateRdsSnapshotCreation with given input', async () => {
    openopsCommonMock.initiateRdsSnapshotCreation.mockResolvedValue(
      'mockResult',
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: `arn:aws:rds:us-west-2:123456789012:db:mysql-db-instance1`,
        shouldWaitForCreation: true,
        waitForTimeInSecondsProperty: { waitForTimeInSeconds: 10 },
        tags: { tag1: 'valu1', tag2: 123 },
        snapshotId: 'snapshotid',
      },
    };

    const result = (await rdsCreateSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.initiateRdsSnapshotCreation).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.initiateRdsSnapshotCreation).toHaveBeenCalledWith({
      credentials: auth,
      region: 'us-west-2',
      dbInstanceId: 'mysql-db-instance1',
      snapshotId: 'snapshotid',
      tags: { tag1: 'valu1', tag2: 123 },
      waitForInSeconds: 10,
    });
  });

  test('should skip the execution when dry run is active', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        dryRun: true,
      },
    };

    const result = await rdsCreateSnapshotAction.run(context);
    expect(result).toEqual('Step execution skipped, dry run flag enabled.');

    expect(
      openopsCommonMock.initiateRdsSnapshotCreation,
    ).not.toHaveBeenCalled();
  });
});
