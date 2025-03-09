/* eslint-disable @typescript-eslint/no-empty-function */
import { BlockPackage } from '@openops/shared';
import { BlockManager } from './block-manager';

export class LocalBlockManager extends BlockManager {
  public override async install(_params: InstallParams): Promise<void> {}
}

type InstallParams = {
  projectPath: string;
  blocks: BlockPackage[];
};
