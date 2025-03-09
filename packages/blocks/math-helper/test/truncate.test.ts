import { truncate } from '../src/lib/actions/truncate';

describe('truncate tests', () => {
  test.each([
    [0, '1'],
    [1, '1.2'],
    [2, '1.23'],
    [4, '1.2345'],
    [10, '1.2345000000'],
  ])(
    'truncate number to the specified number of decimal places',
    async (numberOfDecimalPlaces, expectedResult) => {
      const result = await truncate.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          number: 1.2345,
          numberOfDecimalPlaces,
        },
      });

      expect(result).toBe(expectedResult);
    },
  );
});
