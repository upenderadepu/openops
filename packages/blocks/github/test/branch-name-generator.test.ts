import { generateBranchName } from '../src/lib/common/branch-name-generator';

describe('Generate Branch Name', () => {
  const mockTimestamp = 1700000000;
  const originalDateNow = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => mockTimestamp);
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });

  test.each([
    [
      'My Feature Branch 123!',
      `openops/my-feature-branch-123-${mockTimestamp}`,
    ],
    ['Feature@Branch!', `openops/feature-branch-${mockTimestamp}`],
    ['/Lead-Trailing--/', `openops/lead-trailing-${mockTimestamp}`],
    ['Feature//Branch', `openops/feature/branch-${mockTimestamp}`],
  ])(
    'should return valid branch name',
    async (baseString: string, expected: string) => {
      const result = generateBranchName(baseString);

      expect(result).toBe(expected);
    },
  );
});
