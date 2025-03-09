const sendMock = jest.fn();
const commonMock = {
  ...jest.requireActual('@openops/common'),
  getAwsClient: jest.fn().mockImplementation(() => {
    return {
      send: sendMock,
    };
  }),
};

const waitUntilStackUpdateCompleteMock = jest.fn();
const cloudformationMock = {
  ...jest.requireActual('@aws-sdk/client-cloudformation'),
  waitUntilStackUpdateComplete: waitUntilStackUpdateCompleteMock,
};

jest.mock('@aws-sdk/client-cloudformation', () => cloudformationMock);
jest.mock('@openops/common', () => commonMock);

import { applyTemplateUpdate } from '../src/lib/apply-template-update';

describe('Apply CloudFormation Template', () => {
  const credentials = {
    accessKeyId: 'some accessKeyId',
    secretAccessKey: 'some secretAccessKey',
    defaultRegion: 'some defaultRegion',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update the template of the provided arn successfully', async () => {
    sendMock.mockResolvedValue({ StackId: 'some stack id' });

    const result = await applyTemplateUpdate(
      credentials,
      'some region',
      'some arn',
      'some template',
    );

    expect(result).toEqual({ StackId: 'some stack id' });
    expect(
      cloudformationMock.waitUntilStackUpdateComplete,
    ).toHaveBeenCalledTimes(0);
    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should update the template from the given arn waiting for the update to finish', async () => {
    sendMock.mockResolvedValue({ StackId: 'some stack id' });

    const result = await applyTemplateUpdate(
      credentials,
      'some region',
      'some arn',
      'some template',
      2,
    );

    expect(result).toEqual({ StackId: 'some stack id' });
    expect(
      cloudformationMock.waitUntilStackUpdateComplete,
    ).toHaveBeenCalledTimes(1);
    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should throw error when response contains no template id', async () => {
    sendMock.mockResolvedValue({});

    await expect(
      applyTemplateUpdate(
        credentials,
        'some region',
        'some arn',
        'some template',
      ),
    ).rejects.toThrow('No template found for stack:');

    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  test('should throw error when request fails', async () => {
    sendMock.mockRejectedValue(new Error('some error'));

    await expect(
      applyTemplateUpdate(
        credentials,
        'some region',
        'some arn',
        'some template',
      ),
    ).rejects.toThrow('some error');

    expect(commonMock.getAwsClient).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
