import * as athena from '@aws-sdk/client-athena';
import { getAwsClient } from '../get-client';

export class QueryExecutionHandler {
  private client: athena.AthenaClient;

  constructor(credentials: any, region: string) {
    this.client = getAwsClient(
      athena.AthenaClient,
      credentials,
      region,
    ) as athena.AthenaClient;
  }

  public async startQueryExecution(
    query: string,
    database: string,
    outputBucket: string,
  ): Promise<string | undefined> {
    const params = {
      QueryString: query,
      QueryExecutionContext: { Database: database, Catalog: 'AwsDataCatalog' },
      ResultConfiguration: { OutputLocation: outputBucket },
    };

    const command = new athena.StartQueryExecutionCommand(params);
    const response = await this.client.send(command);

    return response.QueryExecutionId;
  }

  public async getQueryExecutionState(
    queryExecutionId: string,
  ): Promise<athena.QueryExecutionState | undefined> {
    const command = new athena.GetQueryExecutionCommand({
      QueryExecutionId: queryExecutionId,
    });
    const response = await this.client.send(command);

    return response.QueryExecution?.Status?.State;
  }

  public async getQueryResults(
    queryExecutionId: string,
  ): Promise<athena.ResultSet | undefined> {
    const command = new athena.GetQueryResultsCommand({
      QueryExecutionId: queryExecutionId,
    });
    const response = await this.client.send(command);

    return response.ResultSet;
  }
}
