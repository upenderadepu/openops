import * as athena from '@aws-sdk/client-athena';
import { makeAwsRequest } from '../aws-client-wrapper';
import { getAwsClient } from '../get-client';

export async function listAthenaDatabases(
  credentials: any,
  region: string,
  catalogName = 'AwsDataCatalog',
): Promise<athena.Database[]> {
  const client = getAwsClient(athena.AthenaClient, credentials, region);
  const command = new athena.ListDatabasesCommand({
    CatalogName: catalogName,
  });

  const response: unknown[] = await makeAwsRequest(client, command);
  const databaseList: athena.Database[] = response
    .map(
      (response) =>
        (response as unknown as athena.ListDatabasesCommandOutput)
          .DatabaseList || [],
    )
    .flat();

  const filteredResults = databaseList.filter(
    (database) => database.Name !== undefined,
  );
  return filteredResults;
}
