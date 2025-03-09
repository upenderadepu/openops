import { ArrayPropsState } from '@/app/features/builder/block-properties/dynamic-array/array-properties-context';
import { ArrayProperty, PropertyType } from '@openops/blocks-framework';

import { DynamicArrayProperties } from '../types';
import {
  enhanceDynamicProperties,
  getDynamicInput,
  getDynamicRefreshers,
  isSimpleArray,
  mapRefreshersToDynamic,
} from '../utils';

describe('enhanceDynamicProperties', () => {
  const mockFieldData = {
    displayName: 'Field name',
    required: true,
    options: {
      options: [
        {
          label: 'Arn',
          value: {
            id: 22,
            table_id: 7,
            name: 'Arn',
            order: 0,
            type: 'text',
            primary: true,
            read_only: false,
            description: null,
            text_default: '',
          },
        },
      ],
    },
    type: PropertyType.STATIC_DROPDOWN,
  };

  it('should return an empty object when arrayProperty has no properties', () => {
    const arrayProperty: ArrayProperty<boolean> = {
      displayName: 'Fields to filter by',
      required: false,
      properties: {},
      type: PropertyType.ARRAY,
      valueSchema: [],
    };
    const result = enhanceDynamicProperties(arrayProperty);
    expect(result).toEqual({});
  });

  it('should return properties unchanged when has no dynamic', () => {
    const arrayProperty: ArrayProperty<boolean> = {
      displayName: 'Fields to filter by',
      required: false,
      properties: {
        fieldData: mockFieldData,
      },
      type: PropertyType.ARRAY,
      valueSchema: [],
    };
    const result = enhanceDynamicProperties(arrayProperty);
    expect(result).toEqual(arrayProperty.properties);
  });

  it('should enhance dynamic property with isDynamic and refreshFieldAttributes', () => {
    const arrayProperty: ArrayProperty<boolean> = {
      displayName: 'Fields to filter by',
      required: false,
      properties: {
        value: {
          displayName: 'Value to search for',
          required: true,
          refreshers: ['fieldData'],
          type: PropertyType.DYNAMIC,
        },
        fieldData: mockFieldData,
      },
      type: PropertyType.ARRAY,
      valueSchema: [],
    };
    const result = enhanceDynamicProperties(arrayProperty);
    expect(result).toEqual({
      ...arrayProperty.properties,
      value: {
        ...arrayProperty.properties.value,
        isDynamic: true,
        refreshFieldAttributes: ['fieldData'],
      },
    });
  });
});

describe('getDynamicInput', () => {
  it('should return undefined dynamicPropertyName and dynamicInput when arrayContext is undefined', () => {
    const result = getDynamicInput('propertyName', 'inputName', undefined, {
      input: {},
    });
    expect(result).toEqual({
      dynamicPropertyName: undefined,
      dynamicInput: undefined,
    });
  });

  it('should return undefined dynamicPropertyName and dynamicInput when propertyName is not in dynamicProps', () => {
    const arrayContext: ArrayPropsState = {
      properties: {
        dynamic: {},
        fields: [],
      },
      parentPropertyKey: '',
    };
    const result = getDynamicInput('propertyName', 'inputName', arrayContext, {
      input: {},
    });
    expect(result).toEqual({
      dynamicPropertyName: undefined,
      dynamicInput: undefined,
    });
  });

  it('should handle propertyName in dynamicProps with correct input', () => {
    const arrayContext: ArrayPropsState = {
      properties: {
        dynamic: {
          attributeName: {
            displayName: 'Attribute name',
            required: true,
            options: {
              options: [],
            },
            type: 'STATIC_DROPDOWN',
          },
          attributeValue: {
            displayName: 'Attribute value',
            required: true,
            refreshers: ['attributeName'],
            type: 'DROPDOWN',
            isDynamic: true,
            refreshFieldAttributes: ['attributeName'],
          },
        },
        fields: [
          {
            attributeName: 'productFamily',
            attributeValue: 'Enterprise Applications',
          },
          {
            attributeName: 'termType',
            attributeValue: 'OnDemand',
          },
        ],
      },
      parentPropertyKey: 'filters.queryFilters',
    };
    const result = getDynamicInput(
      'attributeValue',
      'settings.input.filters.queryFilters.1.attributeValue ',
      arrayContext,
      {
        input: {},
      },
    );

    expect(result).toEqual({
      dynamicPropertyName: 'filters',
      dynamicInput: {
        propertyName: 'attributeValue',
        attributeName: 'termType',
      },
    });
  });

  it('should handle multiple refreshFieldAttributes', () => {
    const arrayContext: ArrayPropsState = {
      properties: {
        dynamic: {
          attributeName: {
            displayName: 'Attribute name',
            required: true,
            options: {
              options: [],
            },
            type: 'STATIC_DROPDOWN',
          },
          attributeValue: {
            displayName: 'Attribute value',
            required: true,
            refreshers: ['attributeName', 'attributeValue'],
            type: 'DROPDOWN',
            isDynamic: true,
            refreshFieldAttributes: ['attributeName', 'attributeValue'],
          },
        },
        fields: [
          {
            attributeName: 'productFamily',
            attributeValue: 'Enterprise Applications',
          },
          {
            attributeName: 'termType',
            attributeValue: 'OnDemand',
          },
        ],
      },
      parentPropertyKey: 'filters.queryFilters',
    };
    const result = getDynamicInput(
      'attributeValue',
      'settings.input.filters.queryFilters.1.attributeValue ',
      arrayContext,
      {
        input: {},
      },
    );

    expect(result).toEqual({
      dynamicPropertyName: 'filters',
      dynamicInput: {
        propertyName: 'attributeValue',
        attributeName: 'termType',
        attributeValue: 'OnDemand',
      },
    });
  });

  it('should return undefined dynamicProps if parentPropertyKey does not include a dot', () => {
    const arrayContext: ArrayPropsState = {
      properties: {
        dynamic: {
          propertyName: { refreshFieldAttributes: ['attributeKey'] },
        },
        fields: [{ attributeKey: 'value' }],
      },
      parentPropertyKey: 'parentPropertyKey',
    };
    const result = getDynamicInput('propertyName', 'inputName', arrayContext, {
      input: {},
    });
    expect(result).toEqual({
      dynamicPropertyName: undefined,
      dynamicInput: undefined,
    });
  });
});

describe('getDynamicRefreshers', () => {
  it('should return empty array when isDynamic is false', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {};
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      'inputName',
      false,
    );
    expect(result.length).toBe(0);
  });

  it('should return empty array when inputName is an empty string', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {};
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      '',
      true,
    );
    expect(result.length).toBe(0);
  });

  it('should return null when propertyName is not in dynamicProperties', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {};
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      'inputName',
      true,
    );
    expect(result.length).toBe(0);
  });

  it('should return empty arrat when propertyName is in dynamicProperties but refreshFieldAttributes is empty array', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {
      propertyName: {},
    };
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      'inputName',
      true,
    );
    expect(result.length).toBe(0);
  });

  it('should return the modified inputName when propertyName is in dynamicProperties and refreshFieldAttributes is defined', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {
      propertyName: { refreshFieldAttributes: ['attribute'] },
    };
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      'settings.input.propertyName',
      true,
    );
    expect(result).toEqual(['settings.input.attribute']);
  });

  it('should return multiple refreshers when propertyName is in dynamicProperties and refreshFieldAttributes is defined', () => {
    const dynamicProperties: Record<string, DynamicArrayProperties> = {
      propertyName: { refreshFieldAttributes: ['attribute1', 'attribute2'] },
    };
    const result = getDynamicRefreshers(
      dynamicProperties,
      'propertyName',
      'settings.input.propertyName',
      true,
    );
    expect(result).toEqual([
      'settings.input.attribute1',
      'settings.input.attribute2',
    ]);
  });

  describe('mapRefreshersToDynamic', () => {
    it('should handle empty input', () => {
      expect(mapRefreshersToDynamic([], undefined, {}, '', '')).toEqual([]);
    });

    it.each([
      {},
      {
        propertyName: { refreshFieldAttributes: ['attribute'] },
      },
    ])(
      'when no dynamic properties are defined for the field, it should return same input',
      (dynamicProperties) => {
        expect(
          mapRefreshersToDynamic(['attribute'], {}, dynamicProperties, '', ''),
        ).toEqual(['settings.input.attribute']);
      },
    );

    it('should map refreshers correctly for valid input', () => {
      const dynamicProperties: Record<string, DynamicArrayProperties> = {
        propertyName: {
          refreshFieldAttributes: ['attribute1', 'attribute2'],
        },
      };
      expect(
        mapRefreshersToDynamic(
          ['attribute1', 'attribute2'],
          dynamicProperties['propertyName'],
          dynamicProperties,
          'propertyName',
          'settings.input.propertyName',
        ),
      ).toEqual(['settings.input.attribute1', 'settings.input.attribute2']);
    });

    it('should map refreshers correctly for valid input when some are not dynamic', () => {
      const dynamicProperties: Record<string, DynamicArrayProperties> = {
        propertyName: {
          refreshFieldAttributes: ['attribute1'],
        },
      };
      expect(
        mapRefreshersToDynamic(
          ['auth', 'attribute2'],
          dynamicProperties['propertyName'],
          dynamicProperties,
          'propertyName',
          'settings.input.propertyName',
        ),
      ).toEqual(['settings.input.auth', 'settings.input.attribute2']);
    });
  });

  describe('isSimpleArray', () => {
    it('should return true when properties is undefined', () => {
      const array = {
        displayName: 'Some Array',
        required: true,
        properties: undefined,
      } as ArrayProperty<boolean>;

      expect(isSimpleArray(array)).toBe(true);
    });

    it('should return false when properties is defined', () => {
      const array = {
        displayName: 'Some Array',
        required: false,
        properties: {},
      } as ArrayProperty<boolean>;

      expect(isSimpleArray(array)).toBe(false);
    });
  });
});
