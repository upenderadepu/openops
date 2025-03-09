const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsForAccount: jest.fn(),
  initiateRdsSnapshotDeletion: jest.fn(),
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

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

import { rdsDeleteSnapshotAction } from '../../src/lib/actions/rds/rds-delete-snapshot-action';

describe('rdsDeleteSnapshotAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsForAccount.mockResolvedValue(auth);
  });

  test('should create action with correct properties', () => {
    expect(rdsDeleteSnapshotAction.props).toMatchObject({
      arn: {
        required: true,
        type: 'SHORT_TEXT',
      },
      shouldWaitForCreation: {
        type: 'CHECKBOX',
        required: true,
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.initiateRdsSnapshotDeletion.mockResolvedValue(
      'mockResult',
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: 'arn:aws:rds:us-west-2:123456789012:snapshot:rds:snap-1234567890abcdef0',
        waitForTimeInSecondsProperty: {},
      },
    };

    const result = (await rdsDeleteSnapshotAction.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledTimes(1);
    expect(openopsCommonMock.getCredentialsForAccount).toHaveBeenCalledWith(
      context.auth,
      '123456789012',
    );
  });

  test('should throw an error when initiateRdsSnapshotDeletion throws error', async () => {
    openopsCommonMock.initiateRdsSnapshotDeletion.mockRejectedValue(
      new Error('mockError'),
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: `arn:aws:rds:us-west-2:123456789012:snapshot:rds:snap-1234567890abcdef0`,
        waitForTimeInSecondsProperty: {},
      },
    };

    await expect(rdsDeleteSnapshotAction.run(context)).rejects.toThrow(
      'mockError',
    );
  });

  test('should call initiateRdsSnapshotDeletion with given input', async () => {
    openopsCommonMock.initiateRdsSnapshotDeletion.mockResolvedValue(
      'mockResult',
    );

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        arn: `arn:aws:rds:us-west-2:123456789012:snapshot:rds:snap-1234567890abcdef0`,
        shouldWaitForCreation: true,
        waitForTimeInSecondsProperty: { waitForTimeInSeconds: 10 },
      },
    };

    const result = (await rdsDeleteSnapshotAction.run(context)) as any;
    expect(result).toEqual('mockResult');

    expect(openopsCommonMock.initiateRdsSnapshotDeletion).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.initiateRdsSnapshotDeletion).toHaveBeenCalledWith(
      auth,
      'us-west-2',
      'snap-1234567890abcdef0',
      10,
    );
  });

  test('should skip the execution when dry run is active', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        dryRun: true,
      },
    };

    const result = await rdsDeleteSnapshotAction.run(context);
    expect(result).toEqual('Step execution skipped, dry run flag enabled.');

    expect(
      openopsCommonMock.initiateRdsSnapshotDeletion,
    ).not.toHaveBeenCalled();
  });
});
