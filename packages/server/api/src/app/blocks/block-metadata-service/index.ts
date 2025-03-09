import {
  BlockMetadataModel,
  BlockMetadataModelSummary,
} from '@openops/blocks-framework';
import {
  BlocksSource,
  logger,
  SharedSystemProp,
  system,
} from '@openops/server-shared';
import {
  assertNotNullOrUndefined,
  BlockPackage,
  PackageType,
  PrivateBlockPackage,
  PublicBlockPackage,
  SuggestionType,
} from '@openops/shared';
import { fileService } from '../../file/file.service';
import { BlockMetadataSchema } from '../block-metadata-entity';
import { BlockMetadataService } from './block-metadata-service';
import { FastDbBlockMetadataService } from './db-block-metadata-service';
import { FileBlockMetadataService } from './file-block-metadata-service';

const initBlockMetadataService = (): BlockMetadataService => {
  const source = system.getOrThrow<BlocksSource>(
    SharedSystemProp.BLOCKS_SOURCE,
  );
  switch (source) {
    case BlocksSource.DB:
    case BlocksSource.CLOUD_AND_DB:
      return FastDbBlockMetadataService();
    case BlocksSource.FILE:
      logger.info('Using file block metadata service');
      return FileBlockMetadataService();
  }
};

export const blockMetadataService = initBlockMetadataService();

export const getBlockPackage = async (
  projectId: string,
  pkg:
    | Omit<PublicBlockPackage, 'directoryPath'>
    | Omit<PrivateBlockPackage, 'archiveId' | 'archive'>,
): Promise<BlockPackage> => {
  const blockMetadata = await blockMetadataService.getOrThrow({
    name: pkg.blockName,
    version: pkg.blockVersion,
    projectId,
  });
  switch (pkg.packageType) {
    case PackageType.ARCHIVE: {
      const archiveFile = await fileService.getOneOrThrow({
        fileId: blockMetadata.archiveId!,
      });
      return {
        packageType: PackageType.ARCHIVE,
        blockName: pkg.blockName,
        blockVersion: pkg.blockVersion,
        blockType: pkg.blockType,
        archiveId: blockMetadata.archiveId!,
        archive: archiveFile.data,
      };
    }
    case PackageType.REGISTRY: {
      return {
        packageType: PackageType.REGISTRY,
        blockName: pkg.blockName,
        blockVersion: blockMetadata.version,
        blockType: pkg.blockType,
      };
    }
  }
};

export function toBlockMetadataModelSummary<
  T extends BlockMetadataSchema | BlockMetadataModel,
>(
  blockMetadataEntityList: T[],
  originalMetadataList: T[],
  suggestionType?: SuggestionType,
): BlockMetadataModelSummary[] {
  return blockMetadataEntityList.map((blockMetadataEntity) => {
    const originalMetadata = originalMetadataList.find(
      (p) => p.name === blockMetadataEntity.name,
    );
    assertNotNullOrUndefined(
      originalMetadata,
      `Original metadata not found for ${blockMetadataEntity.name}`,
    );
    return {
      ...blockMetadataEntity,
      actions: Object.keys(originalMetadata.actions).length,
      triggers: Object.keys(originalMetadata.triggers).length,
      suggestedActions:
        suggestionType === SuggestionType.ACTION ||
        suggestionType === SuggestionType.ACTION_AND_TRIGGER
          ? Object.values(blockMetadataEntity.actions)
          : undefined,
      suggestedTriggers:
        suggestionType === SuggestionType.TRIGGER ||
        suggestionType === SuggestionType.ACTION_AND_TRIGGER
          ? Object.values(blockMetadataEntity.triggers)
          : undefined,
    };
  });
}
