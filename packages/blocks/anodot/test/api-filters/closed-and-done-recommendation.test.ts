const propertyHelpers = {
  operatorProperty: jest.fn(),
  dateProperty: jest.fn(),
};
jest.mock('../../src/lib/api-filters/property-helpers', () => propertyHelpers);

import { closedAndDoneRecommendationsProperty } from '../../src/lib/api-filters/closed-and-done-recommendations-property';

describe('categoryProperty', () => {
  test('should return expected property', async () => {
    propertyHelpers.operatorProperty.mockReturnValue('operator');
    propertyHelpers.dateProperty
      .mockReturnValueOnce('date1')
      .mockReturnValueOnce('date2')
      .mockReturnValueOnce('date3')
      .mockReturnValueOnce('date4');

    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = closedAndDoneRecommendationsProperty();
    const closedAndDoneRecommendationsProperties = await result.props(
      { auth: {}, statusFilter: 'some status' } as any,
      context,
    );

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(propertyHelpers.operatorProperty).toHaveBeenCalledTimes(1);
    expect(propertyHelpers.operatorProperty).toHaveBeenCalledWith(
      'Operator',
      '',
    );
    expect(propertyHelpers.dateProperty).toHaveBeenCalledTimes(4);
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      1,
      '(Last update date) From',
      'Start date (Format: yyyy-MM-dd)',
      false,
    );
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      2,
      '(Last update date) To',
      'End date (Format: yyyy-MM-dd)',
      false,
    );
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      3,
      '(Creation date) From',
      'Start date (Format: yyyy-MM-dd)',
      false,
    );
    expect(propertyHelpers.dateProperty).toHaveBeenNthCalledWith(
      4,
      '(Creation date) To',
      'End date (Format: yyyy-MM-dd)',
      false,
    );
    expect(
      closedAndDoneRecommendationsProperties['lastUpdateDateFrom'],
    ).toEqual('date1');
    expect(closedAndDoneRecommendationsProperties['lastUpdateDateTo']).toEqual(
      'date2',
    );
    expect(closedAndDoneRecommendationsProperties['creationDateFrom']).toEqual(
      'date3',
    );
    expect(closedAndDoneRecommendationsProperties['creationDateTo']).toEqual(
      'date4',
    );
    expect(closedAndDoneRecommendationsProperties['operator']).toEqual(
      'operator',
    );
  });

  test('should return empty dynamic property if status filter value is potential_savings', async () => {
    const context = {
      ...jest.requireActual('@openops/blocks-framework'),
      auth: { creds: 'some creds' },
      propsValue: {},
    };

    const result = closedAndDoneRecommendationsProperty();
    const closedAndDoneRecommendationsProperties = await result.props(
      { auth: {}, statusFilter: 'potential_savings' } as any,
      context,
    );

    expect(result).toMatchObject({
      required: true,
      type: 'DYNAMIC',
    });
    expect(closedAndDoneRecommendationsProperties).toEqual({});
  });
});
