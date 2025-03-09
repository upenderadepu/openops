import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';
import semverMinVersion from 'semver/ranges/min-version';
import { ApplicationError, ErrorCode } from '../common/application-error';
import { BlockPackage, PackageType } from './block';

export const getPackageAliasForBlock = (
  params: GetPackageAliasForBlockParams,
): string => {
  const { blockName, blockVersion } = params;
  return `${blockName}-${blockVersion}`;
};

export const getPackageSpecForBlock = (
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

export const getPackageArchivePathForBlock = (
  params: GetPackageArchivePathForBlockParams,
): string => {
  return `${params.archivePath}/${params.archiveId}.tgz`;
};

export const extractBlockFromModule = <T>(
  params: ExtractBlockFromModuleParams,
): T => {
  const { module, blockName, blockVersion } = params;
  const exports = Object.values(module);

  for (const e of exports) {
    if (e !== null && e !== undefined && e.constructor.name === 'Block') {
      return e as T;
    }
  }

  throw new ApplicationError({
    code: ErrorCode.BLOCK_NOT_FOUND,
    params: {
      blockName,
      blockVersion,
      message: 'Failed to extract block from module.',
    },
  });
};

export const getBlockMajorAndMinorVersion = (blockVersion: string): string => {
  const minimumSemver = semverMinVersion(blockVersion);
  return minimumSemver
    ? `${semverMajor(minimumSemver)}.${semverMinor(minimumSemver)}`
    : `${semverMajor(blockVersion)}.${semverMinor(blockVersion)}`;
};

type GetPackageAliasForBlockParams = {
  blockName: string;
  blockVersion: string;
};

type GetPackageArchivePathForBlockParams = {
  archiveId: string;
  archivePath: string;
};

type ExtractBlockFromModuleParams = {
  module: Record<string, unknown>;
  blockName: string;
  blockVersion: string;
};
