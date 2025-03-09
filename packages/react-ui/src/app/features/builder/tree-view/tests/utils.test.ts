import { Action, Trigger } from '@openops/shared';

import { mapStepsToTreeView } from '../utils';

describe('mapStepsToTreeView', () => {
  it('should return an empty tree when no steps are provided', () => {
    const result = mapStepsToTreeView('root', []);
    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      children: [],
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
    });
  });

  it('should correctly map a single Action step', () => {
    const action = {
      name: 'action1',
      displayName: 'Action 1',
      type: 'CODE',
    } as Action;
    const result = mapStepsToTreeView('root', [action]);
    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'action1',
          isBranch: false,
          name: 'Action 1',
          children: [],
          metadata: {
            nodeName: 'action1',
            nodeType: 'CODE',
          },
        },
      ],
    });
  });

  it('should correctly map a single Trigger step', () => {
    const trigger = {
      name: 'trigger1',
      displayName: 'Trigger 1',
      type: 'EMPTY',
    } as Trigger;
    const result = mapStepsToTreeView('root', [trigger]);
    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger1',
          name: 'Trigger 1',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger1',
            nodeType: 'EMPTY',
          },
        },
      ],
    });
  });

  it('should correctly map multiple steps', () => {
    const steps = [
      {
        name: 'trigger1',
        displayName: 'Trigger 1',
        type: 'EMPTY',
      },
      {
        name: 'action1',
        displayName: 'Action 1',
        type: 'CODE',
      },
      {
        name: 'action2',
        displayName: 'Action 2',
        type: 'CODE',
      },
    ] as (Action | Trigger)[];
    const result = mapStepsToTreeView('root', steps);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger1',
          name: 'Trigger 1',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger1',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'action1',
          name: 'Action 1',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'action1',
            nodeType: 'CODE',
          },
        },
        {
          id: 'action2',
          name: 'Action 2',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'action2',
            nodeType: 'CODE',
          },
        },
      ],
    });
  });

  it('should return a tree with branches', () => {
    const steps = [
      {
        name: 'trigger',
        valid: false,
        displayName: 'Select Trigger',
        type: 'EMPTY',
        settings: {},
      },
      {
        name: 'step_1',
        type: 'BRANCH',
        valid: false,
        settings: {},
        displayName: 'Condition',
        onFailureAction: {
          name: 'step_3',
          type: 'BLOCK',
          valid: true,
          settings: {},
          displayName: 'Create Approval Links',
        },
        onSuccessAction: {
          name: 'step_2',
          type: 'CODE',
          valid: true,
          settings: {},
          displayName: 'Custom TypeScript Code',
        },
      },
    ];
    const result = mapStepsToTreeView('root', steps as (Action | Trigger)[]);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger',
          name: 'Select Trigger',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'step_1',
          name: 'Condition',
          isBranch: false,
          children: [
            {
              id: 'step_1-True',
              name: 'True',
              isBranch: true,
              metadata: {
                nodeName: '',
                nodeType: 'branch',
              },
              children: [
                {
                  id: 'step_2',
                  name: 'Custom TypeScript Code',
                  isBranch: false,
                  children: [],
                  metadata: {
                    nodeName: 'step_2',
                    nodeType: 'CODE',
                  },
                },
              ],
            },
            {
              id: 'step_1-False',
              name: 'False',
              isBranch: true,
              metadata: {
                nodeName: '',
                nodeType: 'branch',
              },
              children: [
                {
                  id: 'step_3',
                  name: 'Create Approval Links',
                  isBranch: false,
                  children: [],
                  metadata: {
                    nodeName: 'step_3',
                    nodeType: 'BLOCK',
                  },
                },
              ],
            },
          ],
          metadata: {
            nodeName: 'step_1',
            nodeType: 'BRANCH',
          },
        },
      ],
    });
  });

  it('should return correct tree for loop', () => {
    const steps = [
      {
        name: 'trigger',
        valid: false,
        displayName: 'Select Trigger',
        type: 'EMPTY',
        settings: {},
      },
      {
        name: 'step_1',
        type: 'LOOP_ON_ITEMS',
        valid: true,
        settings: {},
        displayName: 'Loop on Items',
        firstLoopAction: {
          name: 'step_2',
          type: 'CODE',
          valid: true,
          settings: {},
          nextAction: {
            name: 'step_3',
            type: 'BLOCK',
            valid: false,
            settings: {},
            displayName: 'Run Query',
          },
          displayName: 'Custom TypeScript Code',
        },
      },
    ];
    const result = mapStepsToTreeView('root', steps as (Action | Trigger)[]);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger',
          name: 'Select Trigger',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'step_1',
          name: 'Loop on Items',
          isBranch: false,
          children: [
            {
              id: 'step_2',
              name: 'Custom TypeScript Code',
              isBranch: false,
              children: [],
              metadata: {
                nodeName: 'step_2',
                nodeType: 'CODE',
              },
            },
            {
              id: 'step_3',
              name: 'Run Query',
              isBranch: false,
              children: [],
              metadata: {
                nodeName: 'step_3',
                nodeType: 'BLOCK',
              },
            },
          ],
          metadata: {
            nodeName: 'step_1',
            nodeType: 'LOOP_ON_ITEMS',
          },
        },
      ],
    });
  });

  it('should handle nested loops', () => {
    const steps = [
      {
        name: 'trigger',
        valid: false,
        displayName: 'Select Trigger',
        type: 'EMPTY',
        settings: {},
        nextAction: {
          name: 'step_1',
          type: 'LOOP_ON_ITEMS',
          valid: true,
          settings: {
            items: '',
            inputUiInfo: {
              customizedInputs: {},
            },
          },
          displayName: 'Loop on Items',
          firstLoopAction: {
            name: 'step_2',
            type: 'CODE',
            valid: true,
            settings: {
              input: {},
              sourceCode: {
                code: 'export const code = async (inputs) => {\n  return true;\n};',
                packageJson: '{}',
              },
              inputUiInfo: {
                customizedInputs: {},
              },
              errorHandlingOptions: {
                retryOnFailure: {
                  value: false,
                },
                continueOnFailure: {
                  value: false,
                },
              },
            },
            nextAction: {
              displayName: 'Loop on Items',
              name: 'step_4',
              valid: true,
              type: 'LOOP_ON_ITEMS',
              settings: {
                items: '',
                inputUiInfo: {
                  customizedInputs: {},
                },
              },
              firstLoopAction: {
                displayName: 'Run Query',
                name: 'step_3',
                valid: false,
                type: 'BLOCK',
                settings: {
                  input: {},
                  blockName: '@openops/block-postgres',
                  blockType: 'OFFICIAL',
                  actionName: 'run-query',
                  inputUiInfo: {
                    customizedInputs: {},
                  },
                  packageType: 'REGISTRY',
                  blockVersion: '~0.1.8',
                  errorHandlingOptions: {
                    retryOnFailure: {
                      value: false,
                    },
                    continueOnFailure: {
                      value: false,
                    },
                  },
                },
              },
            },
            displayName: 'Custom TypeScript Code',
          },
        },
      },
      {
        name: 'step_1',
        type: 'LOOP_ON_ITEMS',
        valid: true,
        settings: {
          items: '',
          inputUiInfo: {
            customizedInputs: {},
          },
        },
        displayName: 'Loop on Items',
        firstLoopAction: {
          name: 'step_2',
          type: 'CODE',
          valid: true,
          settings: {
            input: {},
            sourceCode: {
              code: 'export const code = async (inputs) => {\n  return true;\n};',
              packageJson: '{}',
            },
            inputUiInfo: {
              customizedInputs: {},
            },
            errorHandlingOptions: {
              retryOnFailure: {
                value: false,
              },
              continueOnFailure: {
                value: false,
              },
            },
          },
          nextAction: {
            displayName: 'Loop on Items',
            name: 'step_4',
            valid: true,
            type: 'LOOP_ON_ITEMS',
            settings: {
              items: '',
              inputUiInfo: {
                customizedInputs: {},
              },
            },
            firstLoopAction: {
              displayName: 'Run Query',
              name: 'step_3',
              valid: false,
              type: 'BLOCK',
              settings: {
                input: {},
                blockName: '@openops/block-postgres',
                blockType: 'OFFICIAL',
                actionName: 'run-query',
                inputUiInfo: {
                  customizedInputs: {},
                },
                packageType: 'REGISTRY',
                blockVersion: '~0.1.8',
                errorHandlingOptions: {
                  retryOnFailure: {
                    value: false,
                  },
                  continueOnFailure: {
                    value: false,
                  },
                },
              },
            },
          },
          displayName: 'Custom TypeScript Code',
        },
      },
    ];
    const result = mapStepsToTreeView('root', steps as (Action | Trigger)[]);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger',
          name: 'Select Trigger',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'step_1',
          name: 'Loop on Items',
          isBranch: false,
          children: [
            {
              id: 'step_2',
              name: 'Custom TypeScript Code',
              isBranch: false,
              children: [],
              metadata: {
                nodeName: 'step_2',
                nodeType: 'CODE',
              },
            },
            {
              id: 'step_4',
              name: 'Loop on Items',
              isBranch: false,
              children: [
                {
                  id: 'step_3',
                  name: 'Run Query',
                  isBranch: false,
                  children: [],
                  metadata: {
                    nodeName: 'step_3',
                    nodeType: 'BLOCK',
                  },
                },
              ],
              metadata: {
                nodeName: 'step_4',
                nodeType: 'LOOP_ON_ITEMS',
              },
            },
          ],
          metadata: {
            nodeName: 'step_1',
            nodeType: 'LOOP_ON_ITEMS',
          },
        },
      ],
    });
  });

  it('should return correct tree for split', () => {
    const steps = [
      {
        name: 'trigger',
        valid: false,
        displayName: 'Select Trigger',
        type: 'EMPTY',
        settings: {},
        nextAction: {},
      },
      {
        displayName: 'Split',
        name: 'step_20',
        valid: true,
        type: 'SPLIT',
        settings: {
          options: [
            {
              id: 'yO1xQz5DZQXMs7_LnHPEZ',
              name: 'Branch 1',
              conditions: [[]],
            },
            {
              id: 'cfLbmVdj3bs_1kYo_engk',
              name: 'Branch 2',
              conditions: [],
            },
            {
              id: 'P45reMwwhbPN9GlEq8aYl',
              name: 'Branch 3',
              conditions: [],
            },
          ],
          inputUiInfo: {
            customizedInputs: {},
          },
          defaultBranch: 'yO1xQz5DZQXMs7_LnHPEZ',
        },
        branches: [
          {
            optionId: 'yO1xQz5DZQXMs7_LnHPEZ',
            nextAction: {
              displayName: 'Group By',
              name: 'step_7',
              valid: false,
              type: 'BLOCK',
              settings: {},
            },
          },
          {
            optionId: 'cfLbmVdj3bs_1kYo_engk',
            nextAction: {
              displayName: 'Send HTTP request',
              name: 'step_19',
              valid: false,
              type: 'BLOCK',
              settings: {},
            },
          },
          {
            optionId: 'P45reMwwhbPN9GlEq8aYl',
          },
        ],
      },
    ];

    const result = mapStepsToTreeView('root', steps as (Action | Trigger)[]);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger',
          name: 'Select Trigger',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'step_20',
          name: 'Split',
          isBranch: false,
          children: [
            {
              id: 'step_20-yO1xQz5DZQXMs7_LnHPEZ',
              name: 'Branch 1',
              isBranch: true,
              metadata: {
                nodeName: '',
                isDefaultBranch: true,
                nodeType: 'branch',
              },
              children: [
                {
                  id: 'step_7',
                  name: 'Group By',
                  isBranch: false,
                  children: [],
                  metadata: {
                    nodeName: 'step_7',
                    nodeType: 'BLOCK',
                  },
                },
              ],
            },
            {
              id: 'step_20-cfLbmVdj3bs_1kYo_engk',
              name: 'Branch 2',
              isBranch: true,
              metadata: {
                nodeName: '',
                isDefaultBranch: false,
                nodeType: 'branch',
              },
              children: [
                {
                  id: 'step_19',
                  name: 'Send HTTP request',
                  isBranch: false,
                  children: [],
                  metadata: {
                    nodeName: 'step_19',
                    nodeType: 'BLOCK',
                  },
                },
              ],
            },
            {
              id: 'step_20-P45reMwwhbPN9GlEq8aYl',
              name: 'Branch 3',
              isBranch: true,
              metadata: {
                nodeName: '',
                isDefaultBranch: false,
                nodeType: 'branch',
              },
              children: [],
            },
          ],
          metadata: {
            nodeName: 'step_20',
            nodeType: 'SPLIT',
          },
        },
      ],
    });
  });

  it('should handle nested splits', () => {
    const steps = [
      {
        name: 'trigger',
        valid: false,
        displayName: 'Select Trigger',
        type: 'EMPTY',
        settings: {},
        nextAction: {},
      },
      {
        displayName: 'Split',
        name: 'step_20',
        valid: true,
        type: 'SPLIT',
        settings: {
          options: [
            {
              id: 'yO1xQz5DZQXMs7_LnHPEZ',
              name: 'Branch 1',
              conditions: [[]],
            },
            {
              id: 'cfLbmVdj3bs_1kYo_engk',
              name: 'Branch 2',
              conditions: [],
            },
          ],
          inputUiInfo: {},
          defaultBranch: 'yO1xQz5DZQXMs7_LnHPEZ',
        },
        branches: [
          {
            optionId: 'yO1xQz5DZQXMs7_LnHPEZ',
            nextAction: {
              displayName: 'Split',
              name: 'step_1',
              valid: false,
              type: 'SPLIT',
              settings: {
                defaultBranch: '252oBIfs56kYozfMs7roV',
                options: [
                  {
                    id: '252oBIfs56kYozfMs7roV',
                    name: 'Branch 1',
                    conditions: [[]],
                  },
                  {
                    id: 'gyQP1zrcqfCskzIkHPtaX',
                    name: 'Branch 2',
                    conditions: [],
                  },
                  {
                    id: 'lQ7fFSLWKFJpqFuRldp5m',
                    name: 'Branch 3',
                    conditions: [],
                  },
                ],
                inputUiInfo: {
                  customizedInputs: {},
                },
              },
              branches: [
                {
                  optionId: '252oBIfs56kYozfMs7roV',
                },
                {
                  optionId: 'lQ7fFSLWKFJpqFuRldp5m',
                  nextAction: {
                    displayName: 'Custom TypeScript Code',
                    name: 'step_2',
                    valid: true,
                    type: 'CODE',
                    settings: {},
                  },
                },
              ],
            },
          },
          {
            optionId: 'cfLbmVdj3bs_1kYo_engk',
          },
        ],
      },
    ];

    const result = mapStepsToTreeView('root', steps as (Action | Trigger)[]);

    expect(result).toEqual({
      id: 'root',
      name: '',
      isBranch: false,
      metadata: {
        nodeName: '',
        nodeType: 'default',
      },
      children: [
        {
          id: 'trigger',
          name: 'Select Trigger',
          isBranch: false,
          children: [],
          metadata: {
            nodeName: 'trigger',
            nodeType: 'EMPTY',
          },
        },
        {
          id: 'step_20',
          name: 'Split',
          isBranch: false,
          children: [
            {
              id: 'step_20-yO1xQz5DZQXMs7_LnHPEZ',
              name: 'Branch 1',
              isBranch: true,
              metadata: {
                nodeName: '',
                isDefaultBranch: true,
                nodeType: 'branch',
              },
              children: [
                {
                  id: 'step_1',
                  name: 'Split',
                  isBranch: false,
                  children: [
                    {
                      id: 'step_1-252oBIfs56kYozfMs7roV',
                      name: 'Branch 1',
                      isBranch: true,
                      metadata: {
                        nodeName: '',
                        isDefaultBranch: true,
                        nodeType: 'branch',
                      },
                      children: [],
                    },
                    {
                      id: 'step_1-gyQP1zrcqfCskzIkHPtaX',
                      name: 'Branch 2',
                      isBranch: true,
                      metadata: {
                        nodeName: '',
                        isDefaultBranch: false,
                        nodeType: 'branch',
                      },
                      children: [],
                    },
                    {
                      id: 'step_1-lQ7fFSLWKFJpqFuRldp5m',
                      name: 'Branch 3',
                      isBranch: true,
                      metadata: {
                        nodeName: '',
                        isDefaultBranch: false,
                        nodeType: 'branch',
                      },
                      children: [
                        {
                          id: 'step_2',
                          name: 'Custom TypeScript Code',
                          isBranch: false,
                          children: [],
                          metadata: {
                            nodeName: 'step_2',
                            nodeType: 'CODE',
                          },
                        },
                      ],
                    },
                  ],
                  metadata: {
                    nodeName: 'step_1',
                    nodeType: 'SPLIT',
                  },
                },
              ],
            },
            {
              id: 'step_20-cfLbmVdj3bs_1kYo_engk',
              name: 'Branch 2',
              isBranch: true,
              metadata: {
                nodeName: '',
                isDefaultBranch: false,
                nodeType: 'branch',
              },
              children: [],
            },
          ],
          metadata: {
            nodeName: 'step_20',
            nodeType: 'SPLIT',
          },
        },
      ],
    });
  });
});
