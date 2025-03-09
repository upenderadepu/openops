interface AwsInputType1 {
  nextToken?: string;
}

interface AwsInputType2 {
  NextToken?: string;
}

type AwsInputType = AwsInputType1 | AwsInputType2;

export type AwsCommandInput = {
  input: AwsInputType;
};

export interface AwsClient<T extends AwsCommandInput> {
  send: (command: T) => Promise<AwsInputType>;
}

export async function makeAwsRequest<T extends AwsCommandInput>(
  client: AwsClient<T>,
  command: T,
): Promise<unknown[]> {
  command.input = command.input || {};

  const results = [];

  do {
    const result = await client.send(command);

    if (!result) {
      break;
    }

    results.push(result);

    if ('nextToken' in result && result.nextToken) {
      (command.input as AwsInputType1).nextToken = result.nextToken;
    } else if ('NextToken' in result && result.NextToken) {
      (command.input as AwsInputType2).NextToken = result.NextToken;
    } else {
      break;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  return results;
}
