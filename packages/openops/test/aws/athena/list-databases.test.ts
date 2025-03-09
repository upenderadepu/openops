const ListDatabasesCommandMock = jest.fn();

jest.mock('@aws-sdk/client-athena', () => {
  return {
    ...jest.requireActual('@aws-sdk/client-athena'),
    ListDatabasesCommand: ListDatabasesCommandMock,
  };
});

const makeAwsRequestMock = jest.fn();
jest.mock('../../../src/lib/aws/aws-client-wrapper', () => ({
  ...jest.requireActual('../../../src/lib/aws/aws-client-wrapper'),
  makeAwsRequest: makeAwsRequestMock,
}));

const getAwsClientMock = jest.fn().mockReturnValue('mockClient');
jest.mock('../../../src/lib/aws/get-client', () => {
  return {
    getAwsClient: getAwsClientMock,
  };
});

import * as athena from '@aws-sdk/client-athena';
import { listAthenaDatabases } from '../../../src/lib/aws/athena/list-databases';

describe('listAthenaDatabases tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAthenaClient with expected inputs', async () => {
    makeAwsRequestMock.mockResolvedValue([]);

    await listAthenaDatabases('some creds', 'some region');

    expect(getAwsClientMock).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
  });

  test('should return database list', async () => {
    makeAwsRequestMock.mockResolvedValue([
      { DatabaseList: [{ Name: 'mock database' }] },
    ]);

    const result = await listAthenaDatabases(
      'some creds',
      'some region',
      'catalog name',
    );

    expect(result).toEqual([{ Name: 'mock database' }]);
    expect(getAwsClientMock).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
    expect(makeAwsRequestMock).toHaveBeenCalledTimes(1);
    expect(makeAwsRequestMock).toHaveBeenCalledWith(
      'mockClient',
      new ListDatabasesCommandMock({ CatalogName: 'catalog name' }),
    );
  });

  test('should use default catalog if none is provided', async () => {
    makeAwsRequestMock.mockResolvedValue([
      { DatabaseList: [{ Name: 'mock database' }] },
    ]);

    const result = await listAthenaDatabases('some creds', 'some region');

    expect(result).toEqual([{ Name: 'mock database' }]);
    expect(getAwsClientMock).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
    expect(makeAwsRequestMock).toHaveBeenCalledTimes(1);
    expect(makeAwsRequestMock).toHaveBeenCalledWith(
      'mockClient',
      new ListDatabasesCommandMock({ CatalogName: 'AwsDataCatalog' }),
    );
  });

  test('should ufilter out databases without a name', async () => {
    makeAwsRequestMock.mockResolvedValue([
      {
        DatabaseList: [
          { Name: 'mock database with name' },
          { someOtherProperty: 'not a name' },
          { Name: 'another named database' },
        ],
      },
    ]);

    const result = await listAthenaDatabases('some creds', 'some region');

    expect(result).toEqual([
      { Name: 'mock database with name' },
      { Name: 'another named database' },
    ]);
    expect(getAwsClientMock).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
    expect(makeAwsRequestMock).toHaveBeenCalledTimes(1);
    expect(makeAwsRequestMock).toHaveBeenCalledWith(
      'mockClient',
      new ListDatabasesCommandMock({ CatalogName: 'AwsDataCatalog' }),
    );
  });

  test('should throw if makeAwsRequest throws', async () => {
    makeAwsRequestMock.mockRejectedValue(new Error('mock error'));

    await expect(
      listAthenaDatabases('some creds', 'some region'),
    ).rejects.toThrow('mock error');

    expect(getAwsClientMock).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
    expect(makeAwsRequestMock).toHaveBeenCalledTimes(1);
    expect(makeAwsRequestMock).toHaveBeenCalledWith(
      'mockClient',
      new ListDatabasesCommandMock({ CatalogName: 'AwsDataCatalog' }),
    );
  });
});
