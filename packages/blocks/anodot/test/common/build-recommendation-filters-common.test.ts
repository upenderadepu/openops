/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  addClosedAndDoneDateFilters,
  addCustomStatusFilters,
  addFilterIfValid,
  addTagFilterIfValid,
  buildBaseRecommendationsRequestFilters,
} from '../../src/lib/common/build-recommendation-filters-common';

describe('buildBaseRecommendationsRequestFilters', () => {
  test('should return filters with minimal required properties', async () => {
    const result = buildBaseRecommendationsRequestFilters({
      statusFilter: 'some status',
      openedRecommendations: { from: 'from', to: 'to' },
    });

    expect(result).toMatchObject({
      status_filter: 'some status',
      open_recs_creation_date: { from: 'from', to: 'to' },
    });
  });
});

describe('addCustomStatusFilters', () => {
  test.each([
    [null, {}],
    [{}, {}],
    [undefined, {}],
    [
      {
        isOpen: true,
        done: 'done',
        excluded: 'excluded',
      },
      {
        is_open: true,
        user_status: {
          done: 'done',
          excluded: 'excluded',
        },
      },
    ],
  ])(
    'should return customStatus properties if present',
    async (customStatusProperty: any, expectedResult: any) => {
      const filters = {};

      addCustomStatusFilters(filters, {
        customStatus: customStatusProperty,
      });

      expect(filters).toMatchObject(expectedResult);
    },
  );
});

describe('addClosedAndDoneDateFilters', () => {
  test.each([
    [null, {}],
    [{}, {}],
    [undefined, {}],
    [
      {
        lastUpdateDateFrom: 'last update from',
        lastUpdateDateTo: 'last update to',
        creationDateFrom: 'creation date from',
        creationDateTo: 'creation date to',
        operator: 'operator',
      },
      {
        closed_and_done_recs_dates: {
          creation_date: { from: 'creation date from', to: 'creation date to' },
          last_update_date: { from: 'last update from', to: 'last update to' },
          operator: 'operator',
        },
      },
    ],
  ])(
    'should return status and date properties if present',
    async (closedAndDoneRecommendationsProperty: any, expectedResult: any) => {
      const filters = {};

      addClosedAndDoneDateFilters(filters, {
        closedAndDoneRecommendations: closedAndDoneRecommendationsProperty,
      });

      expect(filters).toMatchObject(expectedResult);
    },
  );
});

describe('addTagFilterIfValid', () => {
  test('should return tag filter', async () => {
    const filters = {};

    addTagFilterIfValid(filters, 'filter_key', {
      tag: 'tag',
      eq: 'eq',
      like: 'like',
      operator: 'operator',
      negate: false,
    });

    expect(filters).toMatchObject({
      filter_key: {
        negate: false,
        condition: [
          {
            tag: 'tag',
            eq: 'eq',
            like: 'like',
            operator: 'operator',
          },
        ],
      },
    });
  });

  test.each([null, undefined, {}])(
    'should return empty if property is empty, null or undefined',
    async (tagObject: any) => {
      const filters = {};

      addTagFilterIfValid(filters, 'filter_key', tagObject);

      expect(filters).toMatchObject({});
    },
  );
});

describe('addFilterIfValid', () => {
  test('should return filter', async () => {
    const filters = {};

    addFilterIfValid(filters, 'filter_key', {
      eq: 'eq',
      negate: false,
    });

    expect(filters).toMatchObject({
      filter_key: {
        negate: false,
        eq: 'eq',
      },
    });
  });

  test.each([null, undefined, {}])(
    'should return empty if property is empty, null or undefined',
    async (tagObject: any) => {
      const filters = {};

      addFilterIfValid(filters, 'filter_key', tagObject);

      expect(filters).toMatchObject({});
    },
  );
});
