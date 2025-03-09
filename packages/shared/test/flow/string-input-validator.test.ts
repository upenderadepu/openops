import {
  convertToStringArrayWithValidation,
  convertToStringWithValidation,
} from '../../src/lib/common/utils/string-input-validator';

describe('convertToStringArrayWithValidation tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([['a'], [['a']]])(
    'converts input to string array successfully',
    (input) => {
      const result = convertToStringArrayWithValidation(input, 'errorMsg');

      const expected = Array.isArray(input) ? input : [input];

      expect(result).toStrictEqual(expected);
    },
  );

  test.each([[{}], [null], [undefined], [''], [{ not: 'a string' }]])(
    'should throw an error if the provided input is invalid %p',
    (input: unknown) => {
      expect(() =>
        convertToStringArrayWithValidation(input, 'wrong input'),
      ).toThrow('wrong input');
    },
  );
});

describe('convertToStringWithValidation tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([['a'], [''], [' ']])(
    'converts input to string successfully',
    (input) => {
      const result = convertToStringWithValidation(input, 'errorMsg');

      expect(result).toStrictEqual(input.trim());
    },
  );

  test.each([[[]], [{}], [null], [undefined], [{ not: 'a string' }]])(
    'should throw an error if the provided input is invalid %p',
    (input: unknown) => {
      expect(() => convertToStringWithValidation(input, 'wrong input')).toThrow(
        'wrong input',
      );
    },
  );
});
