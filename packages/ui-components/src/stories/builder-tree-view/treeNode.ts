import { TreeNode } from 'src/components';

export const labelTexts = {
  defaultBranch: 'Branch 1',
  branch1: 'True',
  branch2: 'False',
  loopNodeName: 'Loop on Items',
  conditionNodeName: 'Condition',
  blockNodeName: 'Send Email',
  triggerNodeName: 'Select Trigger',
  longNodeName:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
  longNodeName2:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudan',
  longNodeName3:
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae',
};
export const expandCollapseAllButtonTestId = 'expandCollapseAllButton';

export const expandCollapseAllButtonIconTestIds = {
  expand: 'expandAllTreeViewButton',
  collapse: 'collapseAllTreeViewButton',
};

export const triggerNode: TreeNode = {
  id: 'trigger',
  name: labelTexts.triggerNodeName,
  isBranch: false,
  children: [],
  metadata: {
    nodeName: 'trigger',
    nodeType: 'EMPTY',
  },
};

export const conditionNode: TreeNode = {
  id: 'step_2',
  name: labelTexts.conditionNodeName,
  isBranch: false,
  children: [
    {
      id: 'step_2-True',
      name: labelTexts.branch1,
      isBranch: true,
      metadata: {
        nodeName: labelTexts.branch1,
        nodeType: 'branch',
      },
      children: [
        {
          id: 'step_4',
          name: labelTexts.blockNodeName,
          isBranch: false,
          children: [],
          metadata: {
            nodeName: labelTexts.blockNodeName,
            nodeType: 'BLOCK',
          },
        },
      ],
    },
    {
      id: 'step_3-False',
      name: labelTexts.branch2,
      isBranch: true,
      metadata: {
        nodeName: labelTexts.branch2,
        nodeType: 'branch',
      },
      children: [
        {
          id: 'step_5',
          name: 'Get Account ID',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'Get Account ID',
            nodeType: 'BLOCK',
          },
        },
      ],
    },
  ],
  metadata: {
    nodeName: 'condition',
    nodeType: 'BRANCH',
  },
};

export const blockNode: TreeNode = {
  id: 'step_9',
  name: 'Delay For',
  isBranch: false,
  children: [],
  metadata: {
    nodeName: 'Delay For',
    nodeType: 'BLOCK',
  },
};

export const splitNode: TreeNode = {
  id: 'step_6',
  name: 'Split',
  isBranch: false,
  children: [
    {
      id: 'step_6-S9FAyGQ3RmA0kshTV7KWw',
      name: labelTexts.defaultBranch,
      isBranch: true,
      metadata: {
        nodeName: labelTexts.defaultBranch,
        isDefaultBranch: true,
        nodeType: 'branch',
      },
      children: [
        {
          id: 'step_7',
          name: 'Get Recommendations',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'Get Recommendations',
            nodeType: 'BLOCK',
          },
        },
      ],
    },
    {
      id: 'step_6-zuXPdYqdrsx0HBM4CAtc8',
      name: 'Branch 2',
      isBranch: true,
      metadata: {
        nodeName: 'Branch 2',
        isDefaultBranch: false,
        nodeType: 'branch',
      },
      children: [],
    },
    {
      id: 'step_6-lb4wT3QLNGNcFeeUtZehz',
      name: 'Branch 3',
      isBranch: true,
      metadata: {
        nodeName: 'Branch 3',
        isDefaultBranch: false,
        nodeType: 'branch',
      },
      children: [
        {
          id: 'step_8',
          name: 'Create Approval Links',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'Create Approval Links',
            nodeType: 'BLOCK',
          },
        },
      ],
    },
  ],
  metadata: {
    nodeName: 'Split',
    nodeType: 'SPLIT',
  },
};

export const loopNode: TreeNode = {
  id: 'step_1',
  name: labelTexts.loopNodeName,
  isBranch: false,
  children: [conditionNode],
  metadata: {
    nodeName: labelTexts.loopNodeName,
    nodeType: 'LOOP_ON_ITEMS',
  },
};

export const rootNode: Omit<TreeNode, 'children'> = {
  id: 'root',
  name: '',
  isBranch: false,
  metadata: {
    nodeName: '',
    nodeType: 'default',
  },
};

export const complexTreeNode: TreeNode = {
  ...rootNode,
  children: [triggerNode, loopNode, splitNode, blockNode],
};

export const allNestedCollapsibleNodes: TreeNode = {
  ...rootNode,
  children: [
    triggerNode,
    {
      ...loopNode,
      children: [
        {
          ...splitNode,
          children: [
            {
              ...splitNode.children[0],
              name: labelTexts.blockNodeName,
            },
            {
              ...splitNode.children[1],
              children: [
                {
                  ...conditionNode,
                  children: [
                    {
                      ...conditionNode.children[0],
                      children: [
                        {
                          ...blockNode,
                          name: labelTexts.longNodeName,
                        },
                      ],
                    },
                    conditionNode.children[1],
                  ],
                },
              ],
            },
            {
              ...splitNode.children[2],
              name: labelTexts.blockNodeName,
            },
          ],
        },
      ],
    },
  ],
};
