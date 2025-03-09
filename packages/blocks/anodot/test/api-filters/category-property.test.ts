import { categoryProperty } from '../../src/lib/api-filters/category-property';

describe('categoryProperty', () => {
  test('should return expected property', async () => {
    const result = categoryProperty();

    expect(result).toMatchObject({
      required: false,
      type: 'STATIC_MULTI_SELECT_DROPDOWN',
    });
    expect(result.options.options).toEqual([
      { label: 'Right Sizing', value: 1 },
      { label: 'Commitments', value: 3 },
      { label: 'Terminate', value: 4 },
      { label: 'Unattached', value: 5 },
      { label: 'Generation Upgrade', value: 7 },
      { label: 'Other', value: 999999 },
    ]);
  });
});
