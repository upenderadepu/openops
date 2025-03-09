const propertyHelpers = {
  dateProperty: jest.fn(),
};
jest.mock('../../src/lib/api-filters/property-helpers', () => propertyHelpers);

import { openedRecommendationsProperty } from '../../src/lib/api-filters/opened-recommendations-property';

describe('openedRecommendationsProperty', () => {
  test('should return expected property', async () => {
    propertyHelpers.dateProperty
      .mockReturnValueOnce('date1')
      .mockReturnValueOnce('date2');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = openedRecommendationsProperty();
    const openedRecommendations = await result.props(
      { auth: {} } as any,
      context,
    );

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(propertyHelpers.dateProperty).toHaveBeenCalledTimes(2);
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      1,
      '(Opened recommendations creation date) From',
      'Start date (Format: yyyy-MM-dd)',
    );
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      2,
      '(Opened recommendations creation date) To',
      'End date (Format: yyyy-MM-dd)',
    );
    expect(openedRecommendations['from']).toEqual('date1');
    expect(openedRecommendations['to']).toEqual('date2');
  });

  test('should return empty dynamic property if auth is undefined', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = openedRecommendationsProperty();
    const openedRecommendations = await result.props({} as any, context);

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(openedRecommendations).toEqual({});
  });
});
