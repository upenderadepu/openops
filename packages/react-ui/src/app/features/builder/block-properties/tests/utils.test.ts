import { CUSTOMIZED_INPUT_KEY, isDynamicViewToggled } from '../utils';

describe('isDynamicViewToggled', () => {
  const mockForm = {
    getValues: jest.fn(),
  };

  it('returns true if arrayFieldContext.dynamicViewToggled is true for the propertyName', () => {
    const arrayFieldContext = {
      field: {
        dynamicViewToggled: { testProperty: true },
      },
    };

    const result = isDynamicViewToggled(
      mockForm,
      arrayFieldContext,
      'testProperty',
      'testInput',
    );
    expect(result).toBe(true);
  });

  it('returns false if arrayFieldContext.dynamicViewToggled is false or undefined for the propertyName', () => {
    const arrayFieldContext = {
      field: {
        dynamicViewToggled: { testProperty: false },
      },
    };

    const result = isDynamicViewToggled(
      mockForm,
      arrayFieldContext,
      'testProperty',
      'testInput',
    );
    expect(result).toBe(false);
  });

  it('returns true if form.getValues returns true for the inputName', () => {
    mockForm.getValues.mockImplementation(
      (key: string) => key === `${CUSTOMIZED_INPUT_KEY}testInput`,
    );
    const result = isDynamicViewToggled(
      mockForm,
      null,
      'testProperty',
      'testInput',
    );
    expect(result).toBe(true);
  });

  it('returns true if form.getValues returns true for the propertyName', () => {
    mockForm.getValues.mockImplementation(
      (key: string) => key === `${CUSTOMIZED_INPUT_KEY}testProperty`,
    );
    const result = isDynamicViewToggled(
      mockForm,
      null,
      'testProperty',
      'testInput',
    );
    expect(result).toBe(true);
  });

  it('returns false if neither arrayFieldContext nor form.getValues returns true', () => {
    mockForm.getValues.mockImplementation(() => false);

    const result = isDynamicViewToggled(
      mockForm,
      null,
      'testProperty',
      'testInput',
    );
    expect(result).toBe(false);
  });
});
