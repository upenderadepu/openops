import {
  getArraySchemaNewLength,
  getTransformedKey,
  updateArraySchemaItemsCount,
} from '../utils';

describe('getTransformedKey', () => {
  const numberReplacement = 'anyOf.0.items.';
  const stringReplacement = 'properties.';

  test('should replace numbers with the numberReplacement followed by the number', () => {
    const result = getTransformedKey(
      'user.123.id',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('properties.user.anyOf.0.items.123.properties.id');
  });

  test('should replace strings with the stringReplacement', () => {
    const result = getTransformedKey(
      'name.first',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('properties.name.properties.first');
  });

  test('should handle a mix of numbers and strings', () => {
    const result = getTransformedKey(
      'data.10.name.2.last',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe(
      'properties.data.anyOf.0.items.10.properties.name.anyOf.0.items.2.properties.last',
    );
  });

  test('should handle keys with only numbers', () => {
    const result = getTransformedKey(
      '1.2.3',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('anyOf.0.items.1.anyOf.0.items.2.anyOf.0.items.3');
  });

  test('should handle keys with only strings', () => {
    const result = getTransformedKey(
      'foo.bar.baz',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('properties.foo.properties.bar.properties.baz');
  });

  test('should handle empty key', () => {
    const result = getTransformedKey('', numberReplacement, stringReplacement);
    expect(result).toBe('');
  });

  test('should handle key without any numbers or dots', () => {
    const result = getTransformedKey(
      'name',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('properties.name');
  });

  test('should handle key with only one number', () => {
    const result = getTransformedKey(
      '123',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('anyOf.0.items.123');
  });

  test('should handle key with trailing dots', () => {
    const result = getTransformedKey(
      'user..123..id.',
      numberReplacement,
      stringReplacement,
    );
    expect(result).toBe('properties.user..anyOf.0.items.123..properties.id.');
  });
});

describe('updateArraySchemaWithNewAmountOfItems', () => {
  it('should update minItems and maxItems of the specified array key with newAmount', () => {
    const schema = { arrayField: { minItems: 1, maxItems: 3 } };
    const arrayKey = 'arrayField';
    const newAmount = 5;

    const updatedSchema = updateArraySchemaItemsCount(
      arrayKey,
      schema,
      newAmount,
    );

    expect(updatedSchema).toEqual({
      arrayField: { minItems: newAmount, maxItems: newAmount },
    });
    expect(updatedSchema).not.toBe(schema); // Ensure immutability
  });

  it('should add minItems and maxItems if they are not present in the schema', () => {
    const schema = { arrayField: {} };
    const arrayKey = 'arrayField';
    const newAmount = 4;

    const updatedSchema = updateArraySchemaItemsCount(
      arrayKey,
      schema,
      newAmount,
    );

    expect(updatedSchema).toEqual({
      arrayField: { minItems: newAmount, maxItems: newAmount },
    });
  });
});

describe('getArrayMinimalLength', () => {
  it('should return newSize if newSize is non-zero', () => {
    expect(getArraySchemaNewLength(5)).toBe(5);
  });

  it('should return 1 if newSize is zero and arrayRequired is true', () => {
    expect(getArraySchemaNewLength(0, true)).toBe(1);
  });

  it('should return 0 if newSize is zero and arrayRequired is false', () => {
    expect(getArraySchemaNewLength(0, false)).toBe(0);
  });

  it('should default to arrayRequired being false when not provided', () => {
    expect(getArraySchemaNewLength(0)).toBe(0); // arrayRequired defaults to false
  });
});
