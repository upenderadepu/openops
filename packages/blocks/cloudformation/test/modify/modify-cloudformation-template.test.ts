const yqCliMock = {
  updateResourceProperties: jest.fn(),
};

jest.mock('../../src/lib/yq-cli', () => yqCliMock);

import { modifyTemplate } from '../../src/lib/modify/modify-template';

describe('Update Cloudformation File', () => {
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
      logicalId: {
        required: true,
        type: 'DROPDOWN',
      },
      updates: {
        required: true,
        type: 'DYNAMIC',
      },
    });
  });

  test('should use mandatory properties', async () => {
    yqCliMock.updateResourceProperties.mockResolvedValue('mockResult');
    const context = createContext({
      template: 'a template',
      logicalId: { logicalId: 'logical id', type: 'type' },
      updates: {
        updates: [
          {
            propertyName: 'open_recs_creation_date',
            propertyValue: { propertyValue: '1' },
          },
        ],
      },
    });

    const result = (await modifyTemplate.run(context)) as any;

    expect(result).toEqual('mockResult');
    expect(yqCliMock.updateResourceProperties).toHaveBeenCalledTimes(1);
    expect(yqCliMock.updateResourceProperties).toHaveBeenCalledWith(
      'a template',
      'logical id',
      [
        {
          propertyName: 'open_recs_creation_date',
          propertyValue: { propertyValue: '1' },
        },
      ],
    );
  });

  function createContext(props: unknown) {
    return {
      ...jest.requireActual('@openops/blocks-framework'),
      propsValue: props,
    };
  }
});
