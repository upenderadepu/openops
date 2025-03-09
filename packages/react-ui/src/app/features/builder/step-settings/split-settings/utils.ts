import { nanoid } from 'nanoid';

import { BranchOperator, SplitOption } from '@openops/shared';

export const MAX_BRANCHES = 6;
export const MIN_BRANCHES = 2;
const BRANCH_NAME_PREFIX = 'Branch';

export const createDefaultOptionSettings = () => [
  {
    id: nanoid(),
    name: `${BRANCH_NAME_PREFIX} 1`,
    // no conditions for the default branch
    conditions: [[]],
  },
  {
    id: nanoid(),
    name: `${BRANCH_NAME_PREFIX} 2`,
    conditions: [
      [
        {
          operator: BranchOperator.TEXT_EXACTLY_MATCHES,
          firstValue: '',
          secondValue: '',
          caseSensitive: false,
        },
      ],
    ],
  },
  {
    id: nanoid(),
    name: `${BRANCH_NAME_PREFIX} 3`,
    conditions: [
      [
        {
          operator: BranchOperator.TEXT_EXACTLY_MATCHES,
          firstValue: '',
          secondValue: '',
          caseSensitive: false,
        },
      ],
    ],
  },
];

export const canAdd = (options: SplitOption[]) => {
  return options.length < MAX_BRANCHES;
};

export const canDelete = (
  options: SplitOption[],
  defaultBranch: string,
  currentIndex: number,
) => {
  if (options.length <= MIN_BRANCHES) {
    return false;
  }

  if (options[currentIndex].id === defaultBranch) {
    return false;
  }

  return true;
};

export const getNextName = (options: SplitOption[]) => {
  const splitNo = options
    .map((option) => {
      const match = option.name.match(
        new RegExp(`${BRANCH_NAME_PREFIX} (\\d+)`),
      );
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => !isNaN(num));

  const next = splitNo.length > 0 ? Math.max(...splitNo) + 1 : 1;
  return `${BRANCH_NAME_PREFIX} ${next}`;
};
