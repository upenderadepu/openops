const hcleditMock = {
  deleteResource: jest.fn(),
};

jest.mock('../../src/lib/hcledit-cli', () => hcleditMock);

import { deleteResourceFromTemplate } from '../../src/lib/modify/delete-resource-from-template';

describe('Delete Terraform Resource Action', () => {
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
      resourceNameAndType: {
        required: true,
        type: 'DROPDOWN',
      },
    });
  });

  test.each([
    [{ name: 'name', type: 'type' }],
    ['{ "name": "name","type": "type"}'],
  ])(
    'should call deleteResource with the correct arguments when resource input is %p',
    async (resourceNameAndTypeParam: any) => {
      hcleditMock.deleteResource.mockResolvedValue('mockResult');
      const context = createContext({
        template: 'a template',
        resourceNameAndType: resourceNameAndTypeParam,
      });

      const result = (await deleteResourceFromTemplate.run(context)) as any;

      expect(result).toEqual('mockResult');
      expect(hcleditMock.deleteResource).toHaveBeenCalledTimes(1);
      expect(hcleditMock.deleteResource).toHaveBeenCalledWith(
        'a template',
        'type',
        'name',
      );
    },
  );

  function createContext(props: unknown) {
    return {
      ...jest.requireActual('@openops/blocks-framework'),
      propsValue: props,
    };
  }
});
