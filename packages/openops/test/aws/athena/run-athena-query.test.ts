const queryExecutionHandlerMock = {
  startQueryExecution: jest.fn(),
  getQueryExecutionState: jest.fn(),
  getQueryResults: jest.fn(),
};

jest.mock('../../../src/lib/aws/athena/query-execution-handler', () => {
  return {
    QueryExecutionHandler: jest
      .fn()
      .mockImplementation(() => queryExecutionHandlerMock),
  };
});

const waitForMock = jest.fn();

jest.mock('../../../src/lib/condition-watcher', () => {
  return {
    waitForConditionWithTimeout: waitForMock,
  };
});

import * as athena from '@aws-sdk/client-athena';
import { runAndWaitForQueryResult } from '../../../src/lib/aws/athena/run-athena-query';

describe('runAndWaitForQueryResult tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw if executionId is undefined', async () => {
    queryExecutionHandlerMock.startQueryExecution.mockResolvedValue(undefined);

    await expect(
      runAndWaitForQueryResult(
        'some creds',
        'some region',
        'query',
        'some database name',
        'query output path',
      ),
    ).rejects.toThrow(
      'Could not execute athena query: Error: Failed to start athena query execution.',
    );

    expect(queryExecutionHandlerMock.startQueryExecution).toHaveBeenCalledTimes(
      1,
    );
    expect(queryExecutionHandlerMock.startQueryExecution).toHaveBeenCalledWith(
      'query',
      'some database name',
      'query output path',
    );
    expect(
      queryExecutionHandlerMock.getQueryExecutionState,
    ).not.toHaveBeenCalled();
    expect(queryExecutionHandlerMock.getQueryResults).not.toHaveBeenCalled();
    expect(waitForMock).not.toHaveBeenCalled();
  });

  test.each([
    [athena.QueryExecutionState.QUEUED, false],
    [athena.QueryExecutionState.RUNNING, false],
    [athena.QueryExecutionState.CANCELLED, true],
  ])(
    'waitForConditon resolves to false if state is queued or running',
    async (status: athena.QueryExecutionState, expectedResult: boolean) => {
      let waitForResult;
      waitForMock.mockImplementation(async (func: any) => {
        waitForResult = await func();
        return Promise.resolve();
      });

      queryExecutionHandlerMock.startQueryExecution.mockResolvedValue(
        'some query id',
      );
      queryExecutionHandlerMock.getQueryExecutionState.mockResolvedValue(
        status,
      );

      await expect(
        runAndWaitForQueryResult(
          'some creds',
          'some region',
          'query',
          'some database name',
          'query output path',
        ),
      ).rejects.toThrow(
        `Could not execute athena query: Error: Query execution failed with status: ${status}`,
      );

      expect(waitForResult).toBe(expectedResult);
      expect(waitForMock).toHaveBeenCalledTimes(1);
      expect(waitForMock).toHaveBeenCalledWith(expect.any(Function), 300, 2000);
      expect(
        queryExecutionHandlerMock.startQueryExecution,
      ).toHaveBeenCalledTimes(1);
      expect(
        queryExecutionHandlerMock.startQueryExecution,
      ).toHaveBeenCalledWith(
        'query',
        'some database name',
        'query output path',
      );
      expect(
        queryExecutionHandlerMock.getQueryExecutionState,
      ).toHaveBeenCalledTimes(1);
      expect(
        queryExecutionHandlerMock.getQueryExecutionState,
      ).toHaveBeenCalledWith('some query id');
    },
  );

  test('should return results if status succeeded', async () => {
    waitForMock.mockImplementationOnce(async (func: any) => {
      return Promise.resolve(await func());
    });

    queryExecutionHandlerMock.startQueryExecution.mockResolvedValue(
      'some query id',
    );
    queryExecutionHandlerMock.getQueryExecutionState.mockResolvedValue(
      athena.QueryExecutionState.SUCCEEDED,
    );
    queryExecutionHandlerMock.getQueryResults.mockResolvedValue('mock result');

    const result = await runAndWaitForQueryResult(
      'some creds',
      'some region',
      'query',
      'some database name',
      'query output path',
    );

    expect(result).toStrictEqual('mock result');
    expect(waitForMock).toHaveBeenCalledTimes(1);
    expect(waitForMock).toHaveBeenCalledWith(expect.any(Function), 300, 2000);
    expect(queryExecutionHandlerMock.startQueryExecution).toHaveBeenCalledTimes(
      1,
    );
    expect(queryExecutionHandlerMock.startQueryExecution).toHaveBeenCalledWith(
      'query',
      'some database name',
      'query output path',
    );
    expect(
      queryExecutionHandlerMock.getQueryExecutionState,
    ).toHaveBeenCalledTimes(1);
    expect(
      queryExecutionHandlerMock.getQueryExecutionState,
    ).toHaveBeenCalledWith('some query id');
    expect(queryExecutionHandlerMock.getQueryResults).toHaveBeenCalledTimes(1);
    expect(queryExecutionHandlerMock.getQueryResults).toHaveBeenCalledWith(
      'some query id',
    );
  });

  test.each([
    [athena.QueryExecutionState.FAILED],
    [athena.QueryExecutionState.CANCELLED],
  ])(
    'should throw if status is failed or cancelled',
    async (status: athena.QueryExecutionState) => {
      waitForMock.mockImplementationOnce(async (func: any) => {
        return Promise.resolve(await func());
      });

      queryExecutionHandlerMock.startQueryExecution.mockResolvedValue(
        'some query id',
      );
      queryExecutionHandlerMock.getQueryExecutionState.mockResolvedValue(
        status,
      );
      queryExecutionHandlerMock.getQueryResults.mockResolvedValue(
        'mock result',
      );

      await expect(
        runAndWaitForQueryResult(
          'some creds',
          'some region',
          'query',
          'some database name',
          'query output path',
        ),
      ).rejects.toThrow(
        `Could not execute athena query: Error: Query execution failed with status: ${status}`,
      );

      expect(waitForMock).toHaveBeenCalledTimes(1);
      expect(waitForMock).toHaveBeenCalledWith(expect.any(Function), 300, 2000);
      expect(
        queryExecutionHandlerMock.startQueryExecution,
      ).toHaveBeenCalledTimes(1);
      expect(
        queryExecutionHandlerMock.startQueryExecution,
      ).toHaveBeenCalledWith(
        'query',
        'some database name',
        'query output path',
      );
      expect(
        queryExecutionHandlerMock.getQueryExecutionState,
      ).toHaveBeenCalledTimes(1);
      expect(
        queryExecutionHandlerMock.getQueryExecutionState,
      ).toHaveBeenCalledWith('some query id');
      expect(queryExecutionHandlerMock.getQueryResults).not.toHaveBeenCalled();
    },
  );
});
