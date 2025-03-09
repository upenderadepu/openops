import { flowCanvasUtils } from './flow-canvas-utils';

import {
  mockFlowVersionWithBranch,
  mockFlowVersionWithSplit,
} from './mockFlowVersion';

describe('flowCanvasUtils', () => {
  describe('convertFlowVersionToGraph', () => {
    describe('Branch/Condition', () => {
      it('should convert flow version to graph with correct nodes', () => {
        const result = flowCanvasUtils.convertFlowVersionToGraph(
          mockFlowVersionWithBranch,
        );

        const expectedResultNodes = [
          {
            step: {
              displayName: 'Select Trigger',
              name: 'trigger',
              nextAction: {
                displayName: 'Condition',
                name: 'step_1',
                settings: {
                  conditions: [
                    [
                      {
                        caseSensitive: false,
                        firstValue: '',
                        operator: 'TEXT_CONTAINS',
                        secondValue: '',
                      },
                    ],
                  ],
                  inputUiInfo: { customizedInputs: {} },
                },
                type: 'BRANCH',
                valid: false,
              },
              settings: {},
              type: 'EMPTY',
              valid: false,
            },
          },
          {
            step: {
              displayName: 'Condition',
              name: 'step_1',
              settings: {
                conditions: [
                  [
                    {
                      caseSensitive: false,
                      firstValue: '',
                      operator: 'TEXT_CONTAINS',
                      secondValue: '',
                    },
                  ],
                ],
                inputUiInfo: { customizedInputs: {} },
              },
              type: 'BRANCH',
              valid: false,
            },
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_TRUE_BRANCH',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_FALSE_BRANCH',
          },
          { step: undefined },
        ];

        expect(result.nodes.map((x) => x.data)).toEqual(expectedResultNodes);
      });

      it('should convert flow version to graph with correct edges', () => {
        const result = flowCanvasUtils.convertFlowVersionToGraph(
          mockFlowVersionWithBranch,
        );

        const expectedResultEdges = [
          {
            parentStep: 'trigger',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'stepNode',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_TRUE_BRANCH',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_FALSE_BRANCH',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
        ];

        expect(result.edges.map((x) => x.data)).toEqual(expectedResultEdges);
      });
    });

    describe('Split', () => {
      it('should convert flow version to graph with correct nodes', () => {
        const result = flowCanvasUtils.convertFlowVersionToGraph(
          mockFlowVersionWithSplit,
        );

        const expectedResultNodes = [
          {
            step: {
              name: 'trigger',
              type: 'EMPTY',
              valid: false,
              settings: {},
              nextAction: {
                name: 'step_1',
                type: 'SPLIT',
                valid: true,
                branches: [],
                settings: {
                  options: [
                    {
                      id: 'l1oGme34T2HzW-DdOPC6C',
                      name: 'Branch 1',
                      conditions: [
                        [
                          {
                            operator: 'TEXT_EXACTLY_MATCHES',
                            firstValue: '',
                            secondValue: '',
                            caseSensitive: false,
                          },
                        ],
                      ],
                    },
                    {
                      id: 'PYE3ImwaEw4i8dbRZCJQv',
                      name: 'Branch 2',
                      conditions: [
                        [
                          {
                            operator: 'TEXT_EXACTLY_MATCHES',
                            firstValue: '',
                            secondValue: '',
                            caseSensitive: false,
                          },
                        ],
                      ],
                    },
                  ],
                  inputUiInfo: {
                    customizedInputs: {},
                  },
                  defaultBranch: '',
                },
                displayName: 'Split',
              },
              displayName: 'Select Trigger',
            },
          },
          {
            step: {
              name: 'step_1',
              type: 'SPLIT',
              valid: true,
              branches: [],
              settings: {
                options: [
                  {
                    id: 'l1oGme34T2HzW-DdOPC6C',
                    name: 'Branch 1',
                    conditions: [
                      [
                        {
                          operator: 'TEXT_EXACTLY_MATCHES',
                          firstValue: '',
                          secondValue: '',
                          caseSensitive: false,
                        },
                      ],
                    ],
                  },
                  {
                    id: 'PYE3ImwaEw4i8dbRZCJQv',
                    name: 'Branch 2',
                    conditions: [
                      [
                        {
                          operator: 'TEXT_EXACTLY_MATCHES',
                          firstValue: '',
                          secondValue: '',
                          caseSensitive: false,
                        },
                      ],
                    ],
                  },
                ],
                inputUiInfo: {
                  customizedInputs: {},
                },
                defaultBranch: '',
              },
              displayName: 'Split',
            },
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            branchNodeId: 'l1oGme34T2HzW-DdOPC6C',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            branchNodeId: 'PYE3ImwaEw4i8dbRZCJQv',
          },
          {},
        ];

        expect(result.nodes.map((x) => x.data)).toEqual(expectedResultNodes);
      });

      it('should convert flow version to graph with correct edges', () => {
        const result = flowCanvasUtils.convertFlowVersionToGraph(
          mockFlowVersionWithSplit,
        );

        const expectedResultEdges = [
          {
            parentStep: 'trigger',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'stepNode',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
        ];

        expect(result.edges.map((x) => x.data)).toEqual(expectedResultEdges);
      });

      it('should convert flow version to graph with correct edges when has uneven number of branches', () => {
        const result = flowCanvasUtils.convertFlowVersionToGraph({
          ...mockFlowVersionWithSplit,
          trigger: {
            ...mockFlowVersionWithSplit.trigger,
            nextAction: {
              ...mockFlowVersionWithSplit.trigger.nextAction,
              settings: {
                ...mockFlowVersionWithSplit.trigger.nextAction.settings,
                options: [
                  {
                    id: 'l1oGme34T2HzW-DdOPC6C',
                    name: 'Branch 1',
                    conditions: [],
                  },
                  {
                    id: 'PYE3ImwaEw4i8dbRZCJQv',
                    name: 'Branch 2',
                    conditions: [],
                  },
                  {
                    id: 'PYE3ImwaEw4i8dbRZCJQv',
                    name: 'Branch 3',
                    conditions: [],
                  },
                ],
              },
            },
          },
        });

        const expectedResultEdges = [
          {
            parentStep: 'trigger',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'stepNode',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: false,
            targetType: 'placeholder',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'INSIDE_SPLIT',
            addButton: false,
            targetType: 'bigButton',
          },
          {
            parentStep: 'step_1',
            stepLocationRelativeToParent: 'AFTER',
            addButton: true,
            targetType: 'placeholder',
          },
        ];

        expect(result.edges.map((x) => x.data)).toEqual(expectedResultEdges);
      });
    });
  });
});
