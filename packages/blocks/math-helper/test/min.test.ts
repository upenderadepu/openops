import { min } from '../src/lib/actions/min';

describe('min tests', () => {
  test.each([
    [[], undefined],
    [[1], 1],
    [[1, -1], -1],
    [[3, 1, -1, -3], -3],
  ])(
    'return the minimum number from the list %p',
    async (numbers, expectedResult) => {
      const result = await min.run({
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
      min.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: 'fdgsgddsgsd' as any,
        },
      }),
    ).rejects.toThrow('Numbers must be an array');
  });

  test('throw error if array contains non-numbers', async () => {
    await expect(
      min.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: [1, 'a', 2] as any,
        },
      }),
    ).rejects.toThrow('[DecimalError] Invalid argument: a');
  });
});
