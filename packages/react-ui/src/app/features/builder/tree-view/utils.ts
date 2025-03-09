import { type TreeNode } from '@openops/components/ui';

import { Action, ActionType, Trigger, flowHelper } from '@openops/shared';

type Step = Action | Trigger;

export const mapStepsToTreeView = (
  nodeId: string,
  steps: Step[],
  label?: string,
  isBranch?: boolean,
  isDefaultBranch?: boolean,
  nodeName?: string,
): TreeNode => ({
  id: nodeId,
  name: label || '',
  isBranch: !!isBranch,
  metadata: {
    nodeName: nodeName || '',
    isDefaultBranch,
    nodeType: isBranch ? 'branch' : 'default',
  },
  children: steps.map((step: Step): TreeNode => {
    return {
      id: step.name,
      name: step.displayName,
      isBranch: false,
      children: createChildren(step),
      metadata: {
        nodeName: step.name,
        nodeType: step.type,
      },
    };
  }),
});

const createChildren = (step: Step): TreeNode[] => {
  switch (step.type) {
    case ActionType.BRANCH: {
      const branches = [
        {
          steps: step.onSuccessAction
            ? flowHelper.getAllStepsAtFirstLevel(step.onSuccessAction)
            : [],
          label: 'True',
        },
        {
          steps: step.onFailureAction
            ? flowHelper.getAllStepsAtFirstLevel(step.onFailureAction)
            : [],
          label: 'False',
        },
      ];

      return branches.map((b) => {
        const id = `${step.name}-${b.label}`;
        return mapStepsToTreeView(id, b.steps, b.label, true);
      });
    }
    case ActionType.SPLIT: {
      const branches = step.settings.options.map((optionBranch) => {
        const branch = step.branches?.find(
          (b) => b.optionId === optionBranch.id,
        );
        return {
          id: optionBranch.id,
          steps: branch?.nextAction
            ? flowHelper.getAllStepsAtFirstLevel(branch.nextAction)
            : [],
          label: optionBranch.name,
          isDefaultBranch: branch?.optionId === step.settings.defaultBranch,
        };
      });

      return branches.map((b) => {
        const id = `${step.name}-${b.id}`;
        return mapStepsToTreeView(
          id,
          b.steps,
          b.label,
          true,
          b.isDefaultBranch,
        );
      });
    }
    case ActionType.LOOP_ON_ITEMS: {
      const loopSteps = step.firstLoopAction
        ? flowHelper.getAllStepsAtFirstLevel(step.firstLoopAction)
        : [];

      return mapStepsToTreeView(step.name, loopSteps).children;
    }
    default:
      return [];
  }
};
