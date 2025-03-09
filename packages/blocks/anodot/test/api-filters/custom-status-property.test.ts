const propertyHelpers = {
  booleanProperty: jest.fn(),
};
jest.mock('../../src/lib/api-filters/property-helpers', () => propertyHelpers);

import { customStatusProperty } from '../../src/lib/api-filters/custom-status-property';

describe('customStatusProperty', () => {
  test('should return expected property', async () => {
    propertyHelpers.booleanProperty
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('2')
      .mockReturnValueOnce('3');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = customStatusProperty();
    const customStatus = await result.props(
      { auth: {}, statusFilter: 'custom' } as any,
      context,
    );

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(propertyHelpers.booleanProperty).toHaveBeenCalledTimes(3);
    expect(propertyHelpers.booleanProperty).toHaveBeenNthCalledWith(
      1,
      'Is Open',
      'True to return only open recommendations. False to return only closed.',
    );
    expect(propertyHelpers.booleanProperty).toHaveBeenNthCalledWith(
      2,
      'Done',
      'True to return only recommendations that have this status.',
    );
    expect(propertyHelpers.booleanProperty).toHaveBeenNthCalledWith(
      3,
      'Excluded',
      'True to return only recommendations that have this status.',
    );
    expect(customStatus['isOpen']).toEqual('1');
    expect(customStatus['done']).toEqual('2');
    expect(customStatus['excluded']).toEqual('3');
  });

  test('should return empty dynamic property if status filter value is not custom', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = customStatusProperty();
    const customStatus = await result.props(
      { auth: {}, statusFilter: 'some other status' } as any,
      context,
    );

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(customStatus).toEqual({});
  });
});
