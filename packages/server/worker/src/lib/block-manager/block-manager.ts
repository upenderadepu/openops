import { PackageInfo, SharedSystemProp, system } from '@openops/server-shared';
import {
  BlockPackage,
  getPackageAliasForBlock,
  getPackageArchivePathForBlock,
  PackageType,
} from '@openops/shared';
import { resolve } from 'node:path';

export const PACKAGE_ARCHIVE_PATH = resolve(
  system.getOrThrow(SharedSystemProp.PACKAGE_ARCHIVE_PATH),
);

export abstract class BlockManager {
  public abstract install({
    projectPath,
    blocks,
  }: InstallParams): Promise<void>;

  protected blockToDependency(block: BlockPackage): PackageInfo {
    const packageAlias = getPackageAliasForBlock(block);

    const packageSpec = getPackageSpecForBlock(PACKAGE_ARCHIVE_PATH, block);
    return {
      alias: packageAlias,
      spec: packageSpec,
    };
  }
}

type InstallParams = {
  projectPath: string;
  blocks: BlockPackage[];
};

const getPackageSpecForBlock = (
  packageArchivePath: string,
  params: BlockPackage,
): string => {
  const { packageType, blockName, blockVersion } = params;

  switch (packageType) {
    case PackageType.REGISTRY: {
      return `npm:${blockName}@${blockVersion}`;
    }

    case PackageType.ARCHIVE: {
      const archivePath = getPackageArchivePathForBlock({
        archiveId: params.archiveId,
        archivePath: packageArchivePath,
      });

      return `file:${archivePath}`;
    }
  }
};
