const hcleditMock = {
  updateResourceProperties: jest.fn(),
};

jest.mock('../../src/lib/hcledit-cli', () => hcleditMock);

import { modifyTemplate } from '../../src/lib/modify/modify-template';

describe('Modify Resource Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create action with correct properties', () => {
    expect(Object.keys(modifyTemplate.props).length).toBe(3);
    expect(modifyTemplate.props).toMatchObject({
      template: {
        required: true,
        type: 'LONG_TEXT',
      },
      resourceNameAndType: {
        required: true,
        type: 'DROPDOWN',
      },
      updates: {
        required: true,
        type: 'DYNAMIC',
      },
    });
  });

  test.each([
    [{ name: 'name', type: 'type' }],
    ['{ "name": "name","type": "type"}'],
  ])(
    'should call modify with the correct arguments when resource input is %p',
    async (resourceNameAndTypeParam: any) => {
      hcleditMock.updateResourceProperties.mockResolvedValue('mockResult');
      const context = createContext({
        template: 'a template',
        resourceNameAndType: resourceNameAndTypeParam,
        updates: {
          updates: [
            { propertyName: 'instance_type', propertyValue: 't3.small' },
          ],
        },
      });

      const result = (await modifyTemplate.run(context)) as any;

      expect(result).toEqual('mockResult');
      expect(hcleditMock.updateResourceProperties).toHaveBeenCalledTimes(1);
      expect(hcleditMock.updateResourceProperties).toHaveBeenCalledWith(
        'a template',
        'type',
        'name',
        [{ propertyName: 'instance_type', propertyValue: 't3.small' }],
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
