jest.mock('@openops/server-shared');

const mockWriteFile = jest.fn();
const mockExecuteCommand = jest.fn();

const fsMock = {
  ...jest.requireActual('node:fs/promises'),
  writeFile: mockWriteFile,
};

const commonMock = {
  ...jest.requireActual('@openops/common'),
  executeCommand: mockExecuteCommand,
};

jest.mock('node:fs/promises', () => fsMock);
jest.mock('@openops/common', () => commonMock);

import {
  deleteResource,
  getResourcesLogicalId,
  updateResourceProperties,
} from '../src/lib/yq-cli';

describe('Update Resource Property', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update resource property successfully', async () => {
    const template = `
    Resources:
      MyResource:
        Type:AWS::EC2::Instance
        Properties:
          BucketName: OldName
    `;

    const modifications = [
      { propertyName: 'BucketName', propertyValue: 'NewName' },
      { propertyName: 'BucketName', propertyValue: 'NewName' },
    ];

    mockExecuteCommand.mockResolvedValue({
      exitCode: 0,
      stdOut: 'result',
      stdError: '',
    });

    const result = await updateResourceProperties(
      template,
      'MyResource',
      modifications,
    );

    expect(result).toContain('result');
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockExecuteCommand).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if update command fails', async () => {
    const template = `
    Resources:
      MyResource:
        Type:AWS::EC2::Instance
        Properties:
          BucketName: OldName
    `;

    const modifications = [
      { propertyName: 'BucketName', propertyValue: 'NewName' },
    ];

    mockExecuteCommand.mockResolvedValue({
      exitCode: 1,
      stdOut: '',
      stdError: 'Error',
    });

    await expect(
      updateResourceProperties(template, 'MyResource', modifications),
    ).rejects.toThrow(
      'Failed to modify the template. {"exitCode":1,"stdOut":"","stdError":"Error"}',
    );
  });
});

describe('Get Resources Logical Id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get resources logical id successfully', async () => {
    const template = `
    Resources:
      MyResource1:
        Type:AWS::EC2::Instance
      MyResource2:
        Type:AWS::EC2::Volume
      MyResource3:
        Type:AWS::EC2::DBInstance
    `;

    mockExecuteCommand.mockResolvedValue({
      exitCode: 0,
      stdOut:
        'MyResource1,AWS::EC2::Instance\nMyResource2,AWS::EC2::Volume\nMyResource3,AWS::EC2::DBInstance',
      stdError: '',
    });

    const resources = await getResourcesLogicalId(template);

    expect(resources).toMatchObject([
      { logicalId: 'MyResource1', type: 'AWS::EC2::Instance' },
      { logicalId: 'MyResource2', type: 'AWS::EC2::Volume' },
      { logicalId: 'MyResource3', type: 'AWS::EC2::DBInstance' },
    ]);
    expect(mockExecuteCommand).toHaveBeenCalled();
  });

  test('should return empty resources list', async () => {
    const template = `
    Resources:
      MyResource1:
        Type:AWS::EC2::Instance
      MyResource2:
        Type:AWS::EC2::Volume
      MyResource3:
        Type:AWS::EC2::DBInstance
    `;

    mockExecuteCommand.mockResolvedValue({
      exitCode: 0,
      stdOut: '',
      stdError: '',
    });

    const resources = await getResourcesLogicalId(template);

    expect(resources).toMatchObject([]);
    expect(mockExecuteCommand).toHaveBeenCalled();
  });

  test('should throw an error if get resources logical id command fails', async () => {
    const template = `
    Resources:
      MyResource:
        Type:AWS::EC2::Instance
    `;
    mockExecuteCommand.mockResolvedValue({
      exitCode: 1,
      stdOut: '',
      stdError: 'Error',
    });

    await expect(getResourcesLogicalId(template)).rejects.toThrow(
      'Failed to execute command to get resources logical id.',
    );
  });
});

describe('Delete Resource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete resource from stack successfully', async () => {
    const template = `
    Resources:
      MyResource:
        Type:AWS::EC2::Instance
        Properties:
          BucketName: OldName
    `;

    mockExecuteCommand.mockResolvedValue({
      exitCode: 0,
      stdOut: 'result',
      stdError: '',
    });

    const result = await deleteResource(template, 'MyResource');

    expect(result).toContain('result');
    expect(mockWriteFile).toHaveBeenCalled();
    expect(mockExecuteCommand).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if delete command fails', async () => {
    const template = `
    Resources:
      MyResource:
        Type:AWS::EC2::Instance
        Properties:
          BucketName: OldName
    `;

    mockExecuteCommand.mockResolvedValue({
      exitCode: 1,
      stdOut: '',
      stdError: 'Error',
    });

    await expect(deleteResource(template, 'MyResource')).rejects.toThrow(
      'Failed to modify the template. {"exitCode":1,"stdOut":"","stdError":"Error"}',
    );
  });
});
