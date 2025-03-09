import { sum } from '../src/lib/actions/sum';

describe('sum tests', () => {
  test.each([
    [[], 0],
    [[1], 1],
    [[1, -1], 0],
    [[3.1, 1.2, -1, -3, 0.5], 0.8],
  ])(
    'return the sum of the numbers in the list %p',
    async (numbers, expectedResult) => {
      const result = await sum.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers,
        },
      });

      expect(result).toBe(expectedResult);
    },
  );

  test('throw error if numbers is not an array', async () => {
    await expect(
      sum.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: 'fdgsgddsgsd' as any,
        },
      }),
    ).rejects.toThrow('Numbers must be an array');
  });

  test('throw error if array contains non-numbers', async () => {
    await expect(
      sum.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: [1, 'a', 2] as any,
        },
      }),
    ).rejects.toThrow('[DecimalError] Invalid argument: a');
  });
});
