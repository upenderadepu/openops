import { BranchOperator, SplitOption } from '@openops/shared';

import { canAdd, canDelete, getNextName } from '../utils';

describe('utils', () => {
  const defaultConditions = [
    [
      {
        operator: BranchOperator.TEXT_EXACTLY_MATCHES,
        firstValue: '',
        secondValue: '',
        caseSensitive: false,
      },
    ],
  ];

  describe('canAdd', () => {
    it('returns true when there is space for new branch', () => {
      const options: SplitOption[] = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        name: `Branch ${i}`,
        conditions: defaultConditions,
      }));

      expect(canAdd(options)).toBe(true);
    });
    it('returns false when there is no space for new branch', () => {
      const options: SplitOption[] = Array.from({ length: 6 }, (_, i) => ({
        id: `${i}`,
        name: `Branch ${i}`,
        conditions: defaultConditions,
      }));

      expect(canAdd(options)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('returns false when there are only two branches', () => {
      const options: SplitOption[] = Array.from({ length: 2 }, (_, i) => ({
        id: `${i}`,
        name: `Branch ${i}`,
        conditions: defaultConditions,
      }));

      expect(canDelete(options, '', 1)).toBe(false);
    });
    it('returns false when default branch is deleted', () => {
      const options: SplitOption[] = Array.from({ length: 3 }, (_, i) => ({
        id: `${i}`,
        name: `Branch ${i}`,
        conditions: defaultConditions,
      }));
      expect(canDelete(options, '1', 1)).toBe(false);
    });
    it('returns true when having more than two branches', () => {
      const options: SplitOption[] = Array.from({ length: 3 }, (_, i) => ({
        id: `${i}`,
        name: `Branch ${i}`,
        conditions: defaultConditions,
      }));
      expect(canDelete(options, '2', 0)).toBe(true);
    });
  });

  describe('getNextName', () => {
    it('returns next name', () => {
      const options: SplitOption[] = [
        {
          id: '1',
          name: 'Branch 1',
          conditions: defaultConditions,
        },
        {
          id: '2',
          name: 'Branch 2',
          conditions: defaultConditions,
        },
      ];
      expect(getNextName(options)).toBe('Branch 3');
    });
    it('returns next name when there is no prefix', () => {
      const options: SplitOption[] = [
        {
          id: '1',
          name: 'random name',
          conditions: defaultConditions,
        },
        {
          id: '2',
          name: 'random branch name',
          conditions: defaultConditions,
        },
      ];
      expect(getNextName(options)).toBe('Branch 1');
    });

    it('returns next name when numbers are not consecutive', () => {
      const options: SplitOption[] = [
        {
          id: '1',
          name: 'Branch 1',
          conditions: defaultConditions,
        },
        {
          id: '2',
          name: 'Branch 15',
          conditions: defaultConditions,
        },
        {
          id: '3',
          name: 'Branch 3',
          conditions: defaultConditions,
        },
      ];
      expect(getNextName(options)).toBe('Branch 16');
    });
  });
});
