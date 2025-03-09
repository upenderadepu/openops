import {
  booleanProperty,
  dateProperty,
  operatorProperty,
} from '../../src/lib/api-filters/property-helpers';

describe('booleanProperty', () => {
  test.each([true, false])(
    'should return expected property',
    async (required: boolean) => {
      const result = booleanProperty('some name', 'some description', required);

      expect(result).toMatchObject({
        required: required,
        displayName: 'some name',
        description: 'some description',
        type: 'STATIC_DROPDOWN',
        options: {
          options: [
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
          ],
        },
      });
    },
  );
});

describe('operatorProperty', () => {
  test.each([true, false])(
    'should return expected property',
    async (required: boolean) => {
      const result = operatorProperty(
        'some name',
        'some description',
        required,
      );

      expect(result).toMatchObject({
        required: required,
        displayName: 'some name',
        description: 'some description',
        type: 'STATIC_DROPDOWN',
        options: {
          options: [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
          ],
        },
      });
    },
  );
});

describe('dateProperty', () => {
  test.each([true, false])(
    'should return expected property',
    async (required: boolean) => {
      const result = dateProperty('some name', 'some description', required);

      expect(result).toMatchObject({
        required: required,
        displayName: 'some name',
        description: 'some description',
        type: 'DATE_TIME',
      });
    },
  );
});
