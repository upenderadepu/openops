const sendMock = jest.fn();

jest.mock('@aws-sdk/client-resource-groups-tagging-api', () => {
  return {
    ...jest.requireActual('@aws-sdk/client-resource-groups-tagging-api'),
    ResourceGroupsTaggingAPIClient: jest.fn(() => ({
      send: sendMock,
    })),
  };
});

import { addTagsToResources } from '../../../src/lib/aws/tags/tag-resources';

const CREDENTIALS = {
  accessKeyId: 'some accessKeyId',
  secretAccessKey: 'some secretAccessKey',
  sessionToken: 'some sessionToken',
};

describe('Add tags to resource tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw an error if request fails', async () => {
    const arns = ['arn:aws:ec2:us-east-2:123456789123:volume/vol-1'];
    const tags = { tagKey: 'TagText' };

    sendMock.mockImplementation(() => {
      throw new Error('some error');
    });

    await expect(addTagsToResources(arns, tags, CREDENTIALS)).rejects.toThrow(
      'some error',
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should add tags to resources and identify errors', async () => {
    const resource1 = 'arn:aws:ec2:us-east-1:123456789123:volume/vol-1';
    const resource2 = 'arn:aws:ec2:us-east-1:123456789123:volume/vol-2';
    const resource3 = 'arn:aws:ec2:us-east-2:123456789123:volume/vol-3';
    const resource4 = 'arn:aws:ec2:eu-central-1:123456789123:volume/vol-4';

    const resources = [resource1, resource2, resource3, resource4];

    const tags = {
      tagKey: 'TagText',
    };

    sendMock
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        FailedResourcesMap: { [resource3]: { ErrorMessage: 'Error' } },
      })
      .mockResolvedValueOnce({});

    const result = await addTagsToResources(resources, tags, CREDENTIALS);
    expect(sendMock).toHaveBeenCalledTimes(3);

    expect(result).toEqual({
      succeeded: [resource1, resource2, resource4],
      failed: {
        [resource3]: 'Error',
      },
    });
  });
});
