const yqCliMock = {
  deleteResource: jest.fn(),
};

jest.mock('../../src/lib/yq-cli', () => yqCliMock);

import { deleteResourceFromTemplate } from '../../src/lib/modify/delete-resource-from-template';

describe('Delete Resource Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create action with correct properties', () => {
    expect(Object.keys(deleteResourceFromTemplate.props).length).toBe(2);
    expect(deleteResourceFromTemplate.props).toMatchObject({
      template: {
        required: true,
        type: 'LONG_TEXT',
      },
      logicalId: {
        required: true,
        type: 'DROPDOWN',
      },
    });
  });

  test('should use mandatory properties', async () => {
    yqCliMock.deleteResource.mockResolvedValue('mockResult');
    const context = createContext({
      template: 'a template',
      logicalId: 'logical id',
    });

    const result = (await deleteResourceFromTemplate.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(yqCliMock.deleteResource).toHaveBeenCalledTimes(1);
    expect(yqCliMock.deleteResource).toHaveBeenCalledWith(
      'a template',
      'logical id',
    );
  });

  function createContext(props: unknown) {
    return {
      ...jest.requireActual('@openops/blocks-framework'),
      propsValue: props,
    };
  }
});
