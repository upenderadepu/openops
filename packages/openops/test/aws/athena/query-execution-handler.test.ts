const StartQueryExecutionCommandMock = jest.fn();
const GetQueryExecutionCommandMock = jest.fn();
const GetQueryResultsCommandMock = jest.fn();

jest.mock('@aws-sdk/client-athena', () => {
  return {
    ...jest.requireActual('@aws-sdk/client-athena'),
    StartQueryExecutionCommand: StartQueryExecutionCommandMock,
    GetQueryExecutionCommand: GetQueryExecutionCommandMock,
    GetQueryResultsCommand: GetQueryResultsCommandMock,
  };
});

const sendMock = jest.fn();
const getAwsClientMock = {
  getAwsClient: jest.fn().mockReturnValue({ send: sendMock }),
};

jest.mock('../../../src/lib/aws/get-client', () => getAwsClientMock);

import * as athena from '@aws-sdk/client-athena';
import { QueryExecutionHandler } from '../../../src/lib/aws/athena/query-execution-handler';

describe('constructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call getAthenaClient with expected inputs', async () => {
    new QueryExecutionHandler('some creds', 'some region');
    expect(getAwsClientMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(getAwsClientMock.getAwsClient).toHaveBeenCalledWith(
      athena.AthenaClient,
      'some creds',
      'some region',
    );
  });
});

describe('class functions', () => {
  const client = new QueryExecutionHandler('some creds', 'some region');

  describe('startQueryExecution', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should start query execution', async () => {
      const commandInput = {
        QueryString: 'query',
        QueryExecutionContext: {
          Database: 'some database name',
          Catalog: 'AwsDataCatalog',
        },
        ResultConfiguration: { OutputLocation: 'query output path' },
      };
      StartQueryExecutionCommandMock.mockImplementation(() => {
        return { input: commandInput };
      });
      sendMock.mockResolvedValue({ QueryExecutionId: 'some query id' });

      const result = await client.startQueryExecution(
        'query',
        'some database name',
        'query output path',
      );

      expect(result).toBe('some query id');
      expect(StartQueryExecutionCommandMock).toHaveBeenCalledTimes(1);
      expect(StartQueryExecutionCommandMock).toHaveBeenCalledWith(commandInput);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({ input: commandInput });
    });

    test('should throw if send throws', async () => {
      sendMock.mockRejectedValue(new Error('some error'));

      await expect(
        client.startQueryExecution(
          'query',
          'some database name',
          'query output path',
        ),
      ).rejects.toThrow('some error');
    });
  });

  describe('getQueryExecution', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test.each([
      [{}, undefined],
      [{ QueryExecution: {} }, undefined],
      [{ QueryExecution: { Status: undefined } }, undefined],
      [{ QueryExecution: { Status: { State: 'some state' } } }, 'some state'],
    ])(
      'should return expected result',
      async (sendResult: any, expectedResult) => {
        GetQueryExecutionCommandMock.mockImplementation(() => {
          return { input: { QueryExecutionId: 'some query id' } };
        });
        sendMock.mockResolvedValue(sendResult);

        const result = await client.getQueryExecutionState('some query id');

        expect(result).toBe(expectedResult);
        expect(GetQueryExecutionCommandMock).toHaveBeenCalledTimes(1);
        expect(GetQueryExecutionCommandMock).toHaveBeenCalledWith({
          QueryExecutionId: 'some query id',
        });
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock).toHaveBeenCalledWith({
          input: { QueryExecutionId: 'some query id' },
        });
      },
    );

    test('should throw if send throws', async () => {
      sendMock.mockRejectedValue(new Error('some error'));

      await expect(
        client.getQueryExecutionState('some query id'),
      ).rejects.toThrow('some error');
    });
  });

  describe('getQueryResults', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should return result set', async () => {
      GetQueryResultsCommandMock.mockImplementation(() => {
        return { input: { QueryExecutionId: 'some query id' } };
      });
      sendMock.mockResolvedValue({ ResultSet: 'some result set' });

      const result = await client.getQueryResults('some query id');

      expect(result).toBe('some result set');
      expect(GetQueryResultsCommandMock).toHaveBeenCalledTimes(1);
      expect(GetQueryResultsCommandMock).toHaveBeenCalledWith({
        QueryExecutionId: 'some query id',
      });
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        input: { QueryExecutionId: 'some query id' },
      });
    });

    test('should throw if send throws', async () => {
      sendMock.mockRejectedValue(new Error('some error'));

      await expect(client.getQueryResults('some query id')).rejects.toThrow(
        'some error',
      );
    });
  });
});
