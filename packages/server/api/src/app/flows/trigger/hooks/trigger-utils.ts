import { TriggerBase } from '@openops/blocks-framework';
import {
  ApplicationError,
  BlockTrigger,
  ErrorCode,
  isNil,
  ProjectId,
} from '@openops/shared';
import { blockMetadataService } from '../../../blocks/block-metadata-service';

export const triggerUtils = {
  async getBlockTriggerOrThrow({
    trigger,
    projectId,
  }: GetBlockTriggerOrThrowParams): Promise<TriggerBase> {
    const blockTrigger = await triggerUtils.getBlockTrigger({
      trigger,
      projectId,
    });
    if (isNil(blockTrigger)) {
      throw new ApplicationError({
        code: ErrorCode.BLOCK_TRIGGER_NOT_FOUND,
        params: {
          blockName: trigger.settings.blockName,
          blockVersion: trigger.settings.blockVersion,
          triggerName: trigger.settings.triggerName,
        },
      });
    }
    return blockTrigger;
  },
  async getBlockTrigger({
    trigger,
    projectId,
  }: GetBlockTriggerOrThrowParams): Promise<TriggerBase | null> {
    const block = await blockMetadataService.get({
      projectId,
      name: trigger.settings.blockName,
      version: trigger.settings.blockVersion,
    });
    if (isNil(block) || isNil(trigger.settings.triggerName)) {
      return null;
    }
    const blockTrigger = block.triggers[trigger.settings.triggerName];
    return blockTrigger;
  },
};

type GetBlockTriggerOrThrowParams = {
  trigger: BlockTrigger;
  projectId: ProjectId;
};
