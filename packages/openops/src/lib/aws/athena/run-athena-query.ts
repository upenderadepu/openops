import * as athena from '@aws-sdk/client-athena';
import { waitForConditionWithTimeout } from '../../condition-watcher';
import { QueryExecutionHandler } from './query-execution-handler';

export async function runAndWaitForQueryResult(
  credentials: any,
  region: string,
  query: string,
  databaseName: string,
  outputBucket: string,
  waitForAmountInSeconds = 300,
): Promise<any> {
  try {
    const executor = new QueryExecutionHandler(credentials, region);
    const queryExecutionId = await executor.startQueryExecution(
      query,
      databaseName,
      outputBucket,
    );
    if (!queryExecutionId) {
      throw new Error('Failed to start athena query execution.');
    }
    let status;

    await waitForConditionWithTimeout(
      async () => {
        status = await executor.getQueryExecutionState(queryExecutionId);
        const isFinishedRunning = !(
          status === athena.QueryExecutionState.QUEUED ||
          status === athena.QueryExecutionState.RUNNING
        );

        return isFinishedRunning;
      },
      waitForAmountInSeconds,
      2000,
    );

    if (status === athena.QueryExecutionState.SUCCEEDED) {
      const results = await executor.getQueryResults(queryExecutionId);
      return results;
    }
    throw new Error(`Query execution failed with status: ${status}`);
  } catch (e) {
    throw new Error(`Could not execute athena query: ${e}`);
  }
}
