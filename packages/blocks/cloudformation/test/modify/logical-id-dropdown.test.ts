const yqCliMock = {
  getResourcesLogicalId: jest.fn(),
};

jest.mock('../../src/lib/yq-cli', () => yqCliMock);

import {
  getLogicalIdDropdown,
  getLogicalIdDropdownWithType,
} from '../../src/lib/modify/logical-id-dropdown';

describe('Get LogicalId Dropdown with types', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return list of objects with logical ids and type', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    yqCliMock.getResourcesLogicalId.mockResolvedValue([
      { logicalId: 'logicalId1', type: 'AWS::EC2::Instance' },
      { logicalId: 'logicalId3', type: 'AWS::EC2::Volume' },
    ]);

    const result = getLogicalIdDropdownWithType();
    const options = await result.options({ template: 'template' }, context);

    expect(result).toMatchObject({
      displayName: 'Logical Id',
      description:
        'Logical Id of the resource to be updated. Supported resources: AWS::EC2::Instance, AWS::EC2::Volume, AWS::RDS::DBInstance',
      type: 'DROPDOWN',
    });

    expect(options).toMatchObject({
      disabled: false,
      options: [
        {
          label: 'logicalId1',
          value: { logicalId: 'logicalId1', type: 'AWS::EC2::Instance' },
        },
        {
          label: 'logicalId3',
          value: { logicalId: 'logicalId3', type: 'AWS::EC2::Volume' },
        },
      ],
    });

    expect(yqCliMock.getResourcesLogicalId).toHaveBeenCalled();
  });

  test('should return the template is required message.', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    const result = getLogicalIdDropdownWithType();
    const options = await result.options({ template: '' }, context);

    expect(result).toMatchObject({
      displayName: 'Logical Id',
      type: 'DROPDOWN',
    });

    expect(options).toMatchObject({
      disabled: true,
      options: [],
      placeholder: 'Please provide a template.',
    });

    expect(yqCliMock.getResourcesLogicalId).toHaveBeenCalledTimes(0);
  });

  test('should return no supported types found message.', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    yqCliMock.getResourcesLogicalId.mockResolvedValue([
      { logicalId: 'logicalId1', type: 'type1' },
      { logicalId: 'logicalId2', type: 'type2' },
      { logicalId: 'logicalId3', type: 'type3' },
    ]);

    const result = getLogicalIdDropdownWithType();
    const options = await result.options({ template: 'template' }, context);

    expect(result).toMatchObject({
      displayName: 'Logical Id',
      type: 'DROPDOWN',
    });

    expect(options).toMatchObject({
      disabled: true,
      options: [],
      placeholder:
        'The provided template does not contain resources that can be modified.',
    });

    expect(yqCliMock.getResourcesLogicalId).toHaveBeenCalled();
  });
});

describe('Get LogicalId Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return list of logical ids', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    yqCliMock.getResourcesLogicalId.mockResolvedValue([
      { logicalId: 'logicalId1', type: 'AWS::EC2::Instance' },
      { logicalId: 'logicalId3', type: 'type2' },
    ]);

    const result = getLogicalIdDropdown();
    const options = await result.options({ template: 'template' }, context);

    expect(result).toMatchObject({
      displayName: 'Logical Id',
      description: 'Logical Id of the resource to be deleted.',
      type: 'DROPDOWN',
    });

    expect(options).toMatchObject({
      disabled: false,
      options: [
        { label: 'logicalId1', value: 'logicalId1' },
        { label: 'logicalId3', value: 'logicalId3' },
      ],
    });

    expect(yqCliMock.getResourcesLogicalId).toHaveBeenCalled();
  });

  test('should return the template is required message.', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
    };

    const result = getLogicalIdDropdown();
    const options = await result.options({ template: '' }, context);

    expect(result).toMatchObject({
      displayName: 'Logical Id',
      type: 'DROPDOWN',
    });

    expect(options).toMatchObject({
      disabled: true,
      options: [],
      placeholder: 'Please provide a template.',
    });

    expect(yqCliMock.getResourcesLogicalId).toHaveBeenCalledTimes(0);
  });
});
