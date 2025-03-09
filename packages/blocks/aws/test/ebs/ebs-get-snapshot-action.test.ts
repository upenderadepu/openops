const openopsCommonMock = {
  ...jest.requireActual('@openops/common'),
  getCredentialsListFromAuth: jest.fn(),
  getEbsSnapshots: jest.fn(),
  getAwsAccountsMultiSelectDropdown: jest.fn().mockReturnValue({
    accounts: {
      required: true,
      defaultValue: false,
      type: 'STATIC_MULTI_SELECT_DROPDOWN',
    },
  }),
  filterTagsProperties: jest.fn().mockReturnValue({
    tags: {
      type: 'ARRAY',
    },
    condition: {
      type: 'STATIC_DROPDOWN',
    },
  }),
  filterTags: jest.fn(),
  filterByArnsOrRegionsProperties: jest.fn().mockReturnValue({
    filterByARNs: {
      type: 'CHECK_BOX',
    },
    filterProperty: {
      type: 'DYNAMIC',
    },
  }),
};

jest.mock('@openops/common', () => openopsCommonMock);

import { ebsGetSnapshotsAction } from '../../src/lib/actions/ebs/ebs-get-snapshot-action';

const auth = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  defaultRegion: 'some defaultRegion',
};

describe('ebsGetSnapshotsAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'credentials1',
    ]);
  });

  test('should create action with correct properties', () => {
    expect(Object.keys(ebsGetSnapshotsAction.props).length).toBe(11);
    expect(ebsGetSnapshotsAction.props).toMatchObject({
      accounts: {
        required: true,
        type: 'STATIC_MULTI_SELECT_DROPDOWN',
      },
      filterByARNs: {
        type: 'CHECK_BOX',
      },
      filterProperty: {
        type: 'DYNAMIC',
      },
      volumeIds: {
        type: 'ARRAY',
        required: false,
      },
      status: {
        type: 'STATIC_DROPDOWN',
        required: false,
      },
      storageTier: {
        type: 'STATIC_DROPDOWN',
        required: false,
      },
      minimumCreationDate: {
        type: 'DATE_TIME',
        required: false,
      },
      maximumCreationDate: {
        type: 'DATE_TIME',
        required: false,
      },
      tags: {
        type: 'ARRAY',
      },
      condition: {
        type: 'STATIC_DROPDOWN',
      },
    });
  });

  test('should use the correct credentials', async () => {
    openopsCommonMock.getEbsSnapshots.mockResolvedValue([
      'snapshot1',
      'snapshot2',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: false,
        filterProperty: { regions: ['region1'] },
        accounts: {},
        dryRun: false,
      },
    };

    const result = await ebsGetSnapshotsAction.run(context);

    expect(result).toStrictEqual(['snapshot1', 'snapshot2']);
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      auth,
      undefined,
    );
  });

  test('should call getCredentialsListFromAuth with accounts', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: false,
        filterProperty: { regions: ['region1'] },
        accounts: { accounts: ['1', '2'] },
        dryRun: false,
      },
    };

    await ebsGetSnapshotsAction.run(context);

    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      auth,
      ['1', '2'],
    );
  });

  test('should throw an error when getEbsSnapshots throws error', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: false,
        filterProperty: { regions: ['region1'] },
        accounts: {},
        dryRun: false,
      },
    };
    openopsCommonMock.getEbsSnapshots.mockRejectedValue(new Error('mockError'));

    await expect(ebsGetSnapshotsAction.run(context)).rejects.toThrow(
      'mockError',
    );

    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenCalledTimes(1);
  });

  test('should call getEbsSnapshots with given input', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: false,
        filterProperty: { regions: ['region1'] },
        accounts: {},
        volumeIds: ['volume1'],
        status: ['completed'],
        storageTier: ['archive'],
        dryRun: false,
      },
    };

    openopsCommonMock.getEbsSnapshots.mockResolvedValue(['snapshot1']);

    const result = (await ebsGetSnapshotsAction.run(context)) as any;

    expect(result).toEqual(['snapshot1']);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenCalledWith(
      'credentials1',
      ['region1'],
      false,
      [
        { Name: 'status', Values: ['completed'] },
        { Name: 'storage-tier', Values: ['archive'] },
        { Name: 'volume-id', Values: ['volume1'] },
      ],
    );

    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      context.auth,
      undefined,
    );
  });

  test('should try to filter by tags if set', async () => {
    openopsCommonMock.filterTags
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    openopsCommonMock.getEbsSnapshots.mockResolvedValue([
      { Name: 'resource1', Tags: ['tag1'] },
      { Name: 'resource2', Tags: ['tag2'] },
      { Name: 'resource3', Tags: ['tag3'] },
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterProperty: { regions: ['region1'] },
        accounts: {},
        tags: [{ name: 'some name', pattern: 'some pattern' }],
        condition: 'AND',
        dryRun: false,
      },
    };

    const result = (await ebsGetSnapshotsAction.run(context)) as any;

    expect(result).toStrictEqual([
      { Name: 'resource1', Tags: ['tag1'] },
      { Name: 'resource3', Tags: ['tag3'] },
    ]);
    expect(openopsCommonMock.filterTags).toHaveBeenCalledTimes(3);
    expect(openopsCommonMock.filterTags).toHaveBeenNthCalledWith(
      1,
      ['tag1'],
      [{ name: 'some name', pattern: 'some pattern' }],
      'AND',
    );
    expect(openopsCommonMock.filterTags).toHaveBeenNthCalledWith(
      2,
      ['tag2'],
      [{ name: 'some name', pattern: 'some pattern' }],
      'AND',
    );
    expect(openopsCommonMock.filterTags).toHaveBeenNthCalledWith(
      3,
      ['tag3'],
      [{ name: 'some name', pattern: 'some pattern' }],
      'AND',
    );
  });

  test('should flatten result', async () => {
    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'credentials1',
      'credentials2',
    ]);
    openopsCommonMock.getEbsSnapshots.mockResolvedValueOnce([
      'snapshot1',
      'snapshot2',
    ]);
    openopsCommonMock.getEbsSnapshots.mockResolvedValueOnce([
      'snapshot3',
      'snapshot4',
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterProperty: { regions: ['region1'] },
        dryRun: false,
        accounts: {},
      },
    };

    const result = await ebsGetSnapshotsAction.run(context);

    expect(result).toStrictEqual([
      'snapshot1',
      'snapshot2',
      'snapshot3',
      'snapshot4',
    ]);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenCalledTimes(2);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenNthCalledWith(
      1,
      'credentials1',
      ['region1'],
      false,
      [],
    );
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenNthCalledWith(
      2,
      'credentials2',
      ['region1'],
      false,
      [],
    );

    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledTimes(
      1,
    );
    expect(openopsCommonMock.getCredentialsListFromAuth).toHaveBeenCalledWith(
      auth,
      undefined,
    );
  });

  test('should work with arns', async () => {
    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'credentials1',
    ]);
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: true,
        filterProperty: { arns: ['arn:aws:rds:region1:1:snap-123'] },
        accounts: {},
        dryRun: false,
      },
    };

    openopsCommonMock.getEbsSnapshots.mockResolvedValue(['snapshot1']);

    const result = (await ebsGetSnapshotsAction.run(context)) as any;

    expect(result).toEqual(['snapshot1']);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenCalledWith(
      'credentials1',
      ['region1'],
      false,
      [{ Name: 'snapshot-id', Values: ['snap-123'] }],
    );
  });

  test('should call once per region', async () => {
    openopsCommonMock.getCredentialsListFromAuth.mockResolvedValue([
      'credentials1',
    ]);
    openopsCommonMock.getEbsSnapshots
      .mockResolvedValueOnce(['snapshot1'])
      .mockResolvedValueOnce(['snapshot2']);
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterByARNs: true,
        filterProperty: {
          arns: [
            'arn:aws:rds:region1:1:snap-1',
            'arn:aws:rds:region2:1:snap-2',
            'arn:aws:rds:region1:1:snap-3',
            'arn:aws:rds:region2:1:snap-4',
          ],
        },
        accounts: {},
        dryRun: false,
      },
    };

    const result = (await ebsGetSnapshotsAction.run(context)) as any;

    expect(result).toEqual(['snapshot1', 'snapshot2']);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenCalledTimes(2);
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenNthCalledWith(
      1,
      'credentials1',
      ['region1'],
      false,
      [{ Name: 'snapshot-id', Values: ['snap-1', 'snap-3'] }],
    );
    expect(openopsCommonMock.getEbsSnapshots).toHaveBeenNthCalledWith(
      2,
      'credentials1',
      ['region2'],
      false,
      [{ Name: 'snapshot-id', Values: ['snap-2', 'snap-4'] }],
    );
  });

  test('should filter by date if minimum or maximum date are set', async () => {
    openopsCommonMock.getEbsSnapshots.mockResolvedValue([
      { Name: 'snapshot1', StartTime: '2020-02-02T00:00:00Z' },
      { Name: 'snapshot2', StartTime: '2019-01-01T00:00:00Z' },
      { Name: 'snapshot3', StartTime: '2024-01-01T00:00:00Z' },
    ]);

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: auth,
      propsValue: {
        filterProperty: { regions: ['region1'] },
        accounts: {},
        minimumCreationDate: '2020-01-01T00:00:00Z',
        maximumCreationDate: '2021-01-01T00:00:00Z',
        dryRun: false,
      },
    };

    const result = (await ebsGetSnapshotsAction.run(context)) as any;

    expect(result).toStrictEqual([
      { Name: 'snapshot1', StartTime: '2020-02-02T00:00:00Z' },
    ]);
  });
});
