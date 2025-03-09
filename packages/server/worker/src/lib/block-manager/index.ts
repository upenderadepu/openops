import {
  BlocksSource,
  logger,
  SharedSystemProp,
  system,
} from '@openops/server-shared';
import { BlockManager } from './block-manager';
import { LocalBlockManager } from './local-block-manager';
import { RegistryBlockManager } from './registry-block-manager';

const source = system.getOrThrow<BlocksSource>(SharedSystemProp.BLOCKS_SOURCE);

const getBlockManager = (): BlockManager => {
  const blockManagerVariant: Record<BlocksSource, new () => BlockManager> = {
    [BlocksSource.FILE]: LocalBlockManager,
    [BlocksSource.CLOUD_AND_DB]: RegistryBlockManager,
    [BlocksSource.DB]: RegistryBlockManager,
  };

  const result = new blockManagerVariant[source]();

  logger.debug('Getting the block manager to execute.', {
    blockManageType: result.constructor.name,
    source,
  });

  return result;
};

export const blockManager = getBlockManager();
