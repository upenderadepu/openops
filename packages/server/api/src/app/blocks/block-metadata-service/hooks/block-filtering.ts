import { ActionBase, TriggerBase } from '@openops/blocks-framework';
import {
  BlockCategory,
  isNil,
  OrganizationId,
  SuggestionType,
} from '@openops/shared';
import Fuse from 'fuse.js';
import { organizationService } from '../../../organization/organization.service';
import { BlockMetadataSchema } from '../../block-metadata-entity';

const blockFilterKeys = [
  {
    name: 'displayName',
    weight: 3,
  },
  {
    name: 'description',
    weight: 1,
  },
];

const suggestionLimit = 10;
export const filterBlocksBasedUser = async ({
  searchQuery,
  blocks,
  categories,
  suggestionType,
  organizationId,
}: {
  categories: BlockCategory[] | undefined;
  searchQuery: string | undefined;
  blocks: BlockMetadataSchema[];
  suggestionType?: SuggestionType;
  organizationId?: OrganizationId;
}): Promise<BlockMetadataSchema[]> => {
  return filterBlocksBasedOnFeatures(
    organizationId,
    filterBasedOnCategories({
      categories,
      blocks: filterBasedOnSearchQuery({ searchQuery, blocks, suggestionType }),
    }),
  );
};

export const filterBlocksBasedOnEmbedding = async ({
  organizationId,
  blocks,
}: {
  organizationId?: string;
  blocks: BlockMetadataSchema[];
}): Promise<BlockMetadataSchema[]> => {
  if (isNil(organizationId)) {
    return blocks;
  }
  const organization = await organizationService.getOne(organizationId);
  if (isNil(organization)) {
    return blocks;
  }

  const isEnterprisePremiumBlock = (block: BlockMetadataSchema) =>
    block.categories?.includes(BlockCategory.PREMIUM);

  return blocks.filter((block) => !isEnterprisePremiumBlock(block));
};

async function filterBlocksBasedOnFeatures(
  organizationId: OrganizationId | undefined,
  blocks: BlockMetadataSchema[],
): Promise<BlockMetadataSchema[]> {
  if (isNil(organizationId)) {
    return blocks;
  }
  return blocks;
}

const filterBasedOnSearchQuery = ({
  searchQuery,
  blocks,
  suggestionType,
}: {
  searchQuery: string | undefined;
  blocks: BlockMetadataSchema[];
  suggestionType?: SuggestionType;
}): BlockMetadataSchema[] => {
  if (!searchQuery) {
    return blocks;
  }
  const putActionsAndTriggersInAnArray = blocks.map((block) => {
    const actions = Object.values(block.actions);
    const triggers = Object.values(block.triggers);
    return {
      ...block,
      actions:
        suggestionType === SuggestionType.ACTION ||
        suggestionType === SuggestionType.ACTION_AND_TRIGGER
          ? actions
          : [],
      triggers:
        suggestionType === SuggestionType.TRIGGER ||
        suggestionType === SuggestionType.ACTION_AND_TRIGGER
          ? triggers
          : [],
    };
  });

  const blockWithTriggersAndActionsFilterKeys = [
    ...blockFilterKeys,
    'actions.displayName',
    'actions.description',
    'triggers.displayName',
    'triggers.description',
  ];

  const fuse = new Fuse(putActionsAndTriggersInAnArray, {
    isCaseSensitive: false,
    shouldSort: true,
    keys: blockWithTriggersAndActionsFilterKeys,
    threshold: 0.2,
    distance: 250,
  });

  return fuse.search(searchQuery).map(({ item }) => {
    const suggestedActions = searchForSuggestion(item.actions, searchQuery);
    const suggestedTriggers = searchForSuggestion(item.triggers, searchQuery);
    return {
      ...item,
      actions: suggestedActions,
      triggers: suggestedTriggers,
    };
  });
};

const filterBasedOnCategories = ({
  categories,
  blocks,
}: {
  categories: BlockCategory[] | undefined;
  blocks: BlockMetadataSchema[];
}): BlockMetadataSchema[] => {
  if (!categories) {
    return blocks;
  }

  return blocks.filter((p) => {
    return categories.some((item) => (p.categories ?? []).includes(item));
  });
};

function searchForSuggestion<T extends ActionBase | TriggerBase>(
  actions: T[],
  searchQuery: string,
): Record<string, T> {
  const nestedFuse = new Fuse(actions, {
    isCaseSensitive: false,
    shouldSort: true,
    keys: ['displayName', 'description'],
    threshold: 0.2,
  });
  const suggestions = nestedFuse
    .search(searchQuery, { limit: suggestionLimit })
    .map(({ item }) => item);
  return suggestions.reduce<Record<string, T>>(
    (filteredSuggestions, suggestion) => {
      filteredSuggestions[suggestion.name] = suggestion;
      return filteredSuggestions;
    },
    {},
  );
}
