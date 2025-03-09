import {
  BlockCategory,
  BlockOrderBy,
  BlockSortBy,
  OpenOpsId,
  SuggestionType,
} from '@openops/shared';
import { BlockMetadataSchema } from '../../block-metadata-entity';
import {
  filterBlocksBasedOnEmbedding,
  filterBlocksBasedUser,
} from './block-filtering';
import { sortAndOrderBlocks } from './block-sorting';

export const defaultBlockHooks: BlockMetadataServiceHooks = {
  async filterBlocks(params) {
    const sortedBlocks = sortAndOrderBlocks(
      params.sortBy,
      params.orderBy,
      params.blocks,
    );

    const userBasedBlocks = await filterBlocksBasedUser({
      categories: params.categories,
      searchQuery: params.searchQuery,
      blocks: sortedBlocks,
      organizationId: params.organizationId,
      suggestionType: params.suggestionType,
    });

    const organizationEmbeddedBasedBlocks = filterBlocksBasedOnEmbedding({
      organizationId: params.organizationId,
      blocks: userBasedBlocks,
    });

    return organizationEmbeddedBasedBlocks;
  },
};

let hooks = defaultBlockHooks;

export const blockMetadataServiceHooks = {
  set(newHooks: BlockMetadataServiceHooks): void {
    hooks = newHooks;
  },

  get(): BlockMetadataServiceHooks {
    return hooks;
  },
};

export type BlockMetadataServiceHooks = {
  filterBlocks(p: FilterBlocksParams): Promise<BlockMetadataSchema[]>;
};

export type FilterBlocksParams = {
  includeHidden?: boolean;
  organizationId?: OpenOpsId;
  searchQuery?: string;
  categories?: BlockCategory[];
  projectId?: string;
  sortBy?: BlockSortBy;
  orderBy?: BlockOrderBy;
  blocks: BlockMetadataSchema[];
  suggestionType?: SuggestionType;
};
