import { BlockMetadata, BlockMetadataModel } from '@openops/blocks-framework';
import { logger } from '@openops/server-shared';
import {
  AddBlockRequestBody,
  ApplicationError,
  BlockPackage,
  BlockScope,
  BlockType,
  EngineResponseStatus,
  ErrorCode,
  ExecuteExtractBlockMetadata,
  FileCompression,
  FileId,
  FileType,
  isNil,
  OrganizationId,
  PackageType,
  ProjectId,
} from '@openops/shared';
import { engineRunner } from 'server-worker';
import { fileService } from '../../file/file.service';
import { blockMetadataService } from '../block-metadata-service';

export const blockService = {
  async installBlock(
    organizationId: string | undefined,
    projectId: string,
    params: AddBlockRequestBody,
  ): Promise<BlockMetadataModel> {
    try {
      const blockPackage = await getBlockPackage(
        organizationId,
        projectId,
        params,
      );
      const blockInformation = await extractBlockInformation(blockPackage);
      const archiveId =
        blockPackage.packageType === PackageType.ARCHIVE
          ? blockPackage.archiveId
          : undefined;
      const savedBlock = await blockMetadataService.create({
        blockMetadata: {
          ...blockInformation,
          minimumSupportedRelease:
            blockInformation.minimumSupportedRelease ?? '0.0.0',
          maximumSupportedRelease:
            blockInformation.maximumSupportedRelease ?? '999.999.999',
          name: blockInformation.name,
          version: blockInformation.version,
        },
        projectId: params.scope === BlockScope.PROJECT ? projectId : undefined,
        packageType: params.packageType,
        organizationId,
        blockType: BlockType.CUSTOM,
        archiveId,
      });

      return savedBlock;
    } catch (error) {
      logger.error(error, '[BlockService#add]');

      if ((error as ApplicationError).error.code === ErrorCode.VALIDATION) {
        throw error;
      }
      throw new ApplicationError({
        code: ErrorCode.ENGINE_OPERATION_FAILURE,
        params: {
          message: JSON.stringify(error),
        },
      });
    }
  },
};

const getBlockPackage = async (
  organizationId: string | undefined,
  projectId: string | undefined,
  params: AddBlockRequestBody,
): Promise<BlockPackage> => {
  switch (params.packageType) {
    case PackageType.ARCHIVE: {
      const archiveId = await saveArchive({
        projectId: params.scope === BlockScope.PROJECT ? projectId : undefined,
        organizationId,
        archive: params.blockArchive as Buffer,
      });
      return {
        ...params,
        blockType: BlockType.CUSTOM,
        archive: params.blockArchive as Buffer,
        archiveId,
        packageType: params.packageType,
      };
    }

    case PackageType.REGISTRY: {
      return {
        ...params,
        blockType: BlockType.CUSTOM,
      };
    }
  }
};

const extractBlockInformation = async (
  request: ExecuteExtractBlockMetadata,
): Promise<BlockMetadata> => {
  const engineResponse = await engineRunner.extractBlockMetadata(request);

  if (engineResponse.status !== EngineResponseStatus.OK) {
    throw new Error(
      'Failed to extract block metadata: ' + JSON.stringify(engineResponse),
    );
  }
  return engineResponse.result;
};

const saveArchive = async (
  params: GetBlockArchivePackageParams,
): Promise<FileId> => {
  const { projectId, organizationId, archive } = params;

  const archiveFile = await fileService.save({
    projectId: isNil(organizationId) ? projectId : undefined,
    organizationId,
    data: archive,
    type: FileType.PACKAGE_ARCHIVE,
    compression: FileCompression.NONE,
  });

  return archiveFile.id;
};

type GetBlockArchivePackageParams = {
  archive: Buffer;
  projectId?: ProjectId;
  organizationId?: OrganizationId;
};
