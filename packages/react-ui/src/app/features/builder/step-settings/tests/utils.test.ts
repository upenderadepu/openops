import { BlockMetadataModel } from '@openops/blocks-framework';
import { Action, ActionType, Trigger, TriggerType } from '@openops/shared';

import { getStepTemplateModel } from '../utils';

describe('getStepTemplateModel', () => {
  const mockTriggerBase = {};
  const mockActionBase = {};
  const mockTriggerName = 'triggerName';
  const mockActionName = 'actionName';

  const blockModel = {
    triggers: {
      [mockTriggerName]: mockTriggerBase,
    },
    actions: {
      [mockActionName]: mockActionBase,
    },
  } as unknown as BlockMetadataModel;

  it('should return the correct TriggerBase for valid trigger selection', () => {
    const selectedStep = {
      type: TriggerType.BLOCK,
      settings: {
        triggerName: mockTriggerName,
      },
    } as Trigger;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBe(mockTriggerBase);
  });

  it('should return the correct ActionBase for valid action selection', () => {
    const selectedStep = {
      type: ActionType.BLOCK,
      settings: {
        actionName: mockActionName,
      },
    } as Action;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBe(mockActionBase);
  });

  it("should return undefined when block doesn't have selected trigger", () => {
    const selectedStep = {
      type: TriggerType.BLOCK,
      settings: {
        triggerName: 'unknownTriggerName',
      },
    } as Trigger;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBeUndefined();
  });

  it("should return undefined when block doesn't have selected action", () => {
    const selectedStep = {
      type: ActionType.BLOCK,
      settings: {
        actionName: 'unknownActionName',
      },
    } as Action;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-BLOCK action selection', () => {
    const selectedStep = {
      type: ActionType.CODE,
      settings: {
        actionName: mockActionName,
      },
    } as unknown as Action;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBeUndefined();
  });

  it('should return undefined for EMPTY trigger selection', () => {
    const selectedStep = {
      type: TriggerType.EMPTY,
      settings: {
        triggerName: mockTriggerName,
      },
    } as unknown as Trigger;

    const result = getStepTemplateModel(selectedStep, blockModel);
    expect(result).toBeUndefined();
  });
});
