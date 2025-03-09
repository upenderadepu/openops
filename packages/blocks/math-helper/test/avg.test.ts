import { avg } from '../src/lib/actions/avg';

describe('avg tests', () => {
  test.each([
    [[], undefined],
    [[1], 1],
    [[1, -1], 0],
    [[1, 0], 0.5],
    [[0, -1], -0.5],
    [[3.1, 1.2, -1, -3, 0.5], 0.16],
  ])(
    'return the average number from the list %p',
    async (numbers, expectedResult) => {
      const result = await avg.run({
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
      avg.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: 'fdgsgddsgsd' as any,
        },
      }),
    ).rejects.toThrow('Numbers must be an array');
  });

  test('throw error if array contains non-numbers', async () => {
    await expect(
      avg.run({
        ...jest.requireActual('@openops/blocks-framework'),
        propsValue: {
          numbers: [1, 'a', 2] as any,
        },
      }),
    ).rejects.toThrow('[DecimalError] Invalid argument: a');
  });
});
