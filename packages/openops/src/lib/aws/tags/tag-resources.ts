import {
  ResourceGroupsTaggingAPIClient,
  TagResourcesCommand,
  TagResourcesCommandOutput,
} from '@aws-sdk/client-resource-groups-tagging-api';
import { groupARNsByRegion } from '../regions';

export type TaggingResult = {
  succeeded: string[];
  failed: Record<string, string>;
};

export async function addTagsToResources(
  arns: string[],
  tags: Record<string, string>,
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  },
): Promise<TaggingResult> {
  const arnsByRegion = groupARNsByRegion(arns);

  const result: TaggingResult = { succeeded: [], failed: {} };

  for (const region in arnsByRegion) {
    const arnsList = arnsByRegion[region];
    const command = getTagResourcesCommand(arnsList, tags);

    try {
      const client = getTaggingAPIClient(region, credentials);

      const response: TagResourcesCommandOutput = await client.send(command);

      if (response.FailedResourcesMap) {
        Object.entries(response.FailedResourcesMap).forEach(
          ([key, failureInfo]) => {
            console.log(
              `Error adding tags to resource. Arn: ${key}, Error Message: ${failureInfo.ErrorMessage}`,
            );
            result.failed[key] =
              failureInfo.ErrorMessage ?? 'Error adding tags to resource';
          },
        );
      }

      arnsList
        .filter((arn) => !result.failed[arn])
        .forEach((arn) => result.succeeded.push(arn));
    } catch (error) {
      throw new Error('An error occurred while tagging resources: ' + error);
    }
  }

  return result;
}

function getTagResourcesCommand(
  arnsList: string[],
  tags: Record<string, string>,
): TagResourcesCommand {
  const input = {
    ResourceARNList: arnsList,
    Tags: tags,
  };

  return new TagResourcesCommand(input);
}

function getTaggingAPIClient(
  region: string,
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  },
): ResourceGroupsTaggingAPIClient {
  const auth = {
    region: region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
  };

  return new ResourceGroupsTaggingAPIClient(auth);
}
