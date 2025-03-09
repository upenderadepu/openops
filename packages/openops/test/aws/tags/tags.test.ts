import {
  filterTags,
  filterTagsProperties,
} from '../../../src/lib/aws/tags/tags';

describe('filterByTagsProperties', () => {
  test('fieldsProperties should have correct properties', async () => {
    const result = filterTagsProperties();

    expect(result.condition).toMatchObject({
      displayName: 'Tag Filter Condition',
      type: 'STATIC_DROPDOWN',
      options: {
        disabled: false,
        options: [
          { label: 'AND', value: 'AND' },
          { label: 'OR', value: 'OR' },
        ],
      },
    });
    expect(result.tags).toMatchObject({
      displayName: 'Tags',
      type: 'ARRAY',
      required: false,
      valueSchema: undefined,
      properties: {
        name: {
          displayName: 'Tag Name',
          required: true,
          valueSchema: undefined,
          type: 'LONG_TEXT',
        },
        pattern: {
          displayName: 'Regex Pattern',
          required: true,
          valueSchema: undefined,
          type: 'LONG_TEXT',
        },
      },
    });
  });
});

describe('filterTags', () => {
  const resourceTags = [
    { Key: 'Created by', Value: 'created by 1' },
    { Key: 'Engine', Value: 'some engine 1' },
  ];

  test.each([
    [[{ name: 'Created by', pattern: 'created by 1' }], true, undefined],
    [
      [
        { name: 'Created by', pattern: 'created by 1' },
        { name: 'Engine', pattern: 'some engine 1' },
      ],
      true,
      'AND',
    ],
    [
      [
        { name: 'created by', pattern: 'not a match' },
        { name: 'Engine', pattern: 'some engine 1' },
      ],
      false,
      'AND',
    ],
    [
      [
        { name: 'created by', pattern: 'not a match' },
        { name: 'Engine', pattern: 'some engine 1' },
      ],
      true,
      'OR',
    ],
    [
      [
        { name: 'created by', pattern: 'not a match' },
        { name: 'Engine', pattern: 'also not a match' },
      ],
      false,
      'OR',
    ],
  ])(
    'should return expected result',
    (searchTags: any[], expectedResult: boolean, condition?: string) => {
      const result = filterTags(resourceTags, searchTags, condition);

      expect(result).toBe(expectedResult);
    },
  );
});
