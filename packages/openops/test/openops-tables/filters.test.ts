import {
  buildSimpleFilterUrlParam,
  createFilterGroup,
  createSimpleFilter,
  FilterType,
  ViewFilterTypesEnum,
} from '../../src/lib/openops-tables/filters';

describe('buildSimpleFilterUrlParam', () => {
  test('Should build simple filter string', () => {
    const result = buildSimpleFilterUrlParam(1, ViewFilterTypesEnum.boolean);

    expect(result).toBe('filter__1__boolean');
  });
});

describe('createFilterGroup', () => {
  test('Should build simple filter', () => {
    const result = createSimpleFilter({
      field: 1,
      type: ViewFilterTypesEnum.boolean,
      value: 'test',
    });

    expect(result).toEqual({
      field: 1,
      type: 'boolean',
      value: 'test',
    });
  });

  test('Should build tree with multiple filters and filter type', () => {
    const complexTree = createFilterGroup(FilterType.AND, [
      createSimpleFilter({
        field: 'field_1',
        type: ViewFilterTypesEnum.equal,
        value: 'test',
      }),
      createFilterGroup(FilterType.OR, [
        createSimpleFilter({
          field: 'field_2',
          type: ViewFilterTypesEnum.boolean,
          value: false,
        }),
        createSimpleFilter({
          field: 3,
          type: ViewFilterTypesEnum.higher_than,
          value: 100,
        }),
      ]),
    ]);

    expect(complexTree).toEqual({
      filter_type: FilterType.AND,
      filters: [
        {
          field: 'field_1',
          type: 'equal',
          value: 'test',
        },
        {
          filter_type: FilterType.OR,
          filters: [
            {
              field: 'field_2',
              type: 'boolean',
              value: false,
            },
            {
              field: 3,
              type: 'higher_than',
              value: 100,
            },
          ],
        },
      ],
    });
  });
});
