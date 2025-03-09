const sendMock = jest.fn();
const commonMock = {
  ...jest.requireActual('@openops/common'),
  getAwsClient: jest.fn().mockImplementation(() => {
    return {
      send: sendMock,
    };
  }),
};

jest.mock('@openops/common', () => commonMock);

import { getCloudFormationTemplate } from '../src/lib/get-template';

describe('Get CloudFormation Template', () => {
  const credentials = {
    accessKeyId: 'some accessKeyId',
    secretAccessKey: 'some secretAccessKey',
    defaultRegion: 'some defaultRegion',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get the template of the provided arn successfully', () => {
    sendMock.mockResolvedValue({ TemplateBody: 'some template' });

    const result = getCloudFormationTemplate(
      credentials,
      'some region',
      'some arn',
    );

    expect(result).resolves.toEqual('some template');
    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should throw error when response contains no template body', async () => {
    sendMock.mockResolvedValue({});

    await expect(
      getCloudFormationTemplate(credentials, 'some region', 'some arn'),
    ).rejects.toThrow('No template found for stack:');

    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should throw error when request fails', async () => {
    sendMock.mockRejectedValue(new Error('some error'));

    await expect(
      getCloudFormationTemplate(credentials, 'some region', 'some arn'),
    ).rejects.toThrow('some error');

    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
