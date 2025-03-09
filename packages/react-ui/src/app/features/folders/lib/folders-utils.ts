import { SEARCH_PARAMS } from '@/app/constants/search-params';
import { FlowsSearchState } from '@/app/features/flows/lib/flows-hooks';
import { FolderItem } from '@openops/components/ui';
import { FolderDto, UNCATEGORIZED_FOLDER_ID } from '@openops/shared';

/**
 * Get all child folders of a folder
 * @param {FolderItem} folder
 * @returns {FolderItem[]} all children
 */
const getAllChildFolderItems = (folder: FolderItem): FolderItem[] => {
  if (Array.isArray(folder.children)) {
    return [
      ...folder.children.filter((c) => c.type === 'folder'),
      ...folder.children.flatMap(getAllChildFolderItems),
    ];
  }
  return [];
};

/**
 * Generates a link to a flow with optional custom search parameters.
 *
 * @param {string} flowId - The ID of the flow.
 * @param {boolean} [viewOnly=true] - Whether the flow is view-only.
 * @param {string} [customSearch] - Custom search parameters.
 * @returns {object} An object containing the pathname and search parameters.
 */
const getFlowLink = (
  flowId: string,
  viewOnly = true,
  customSearch?: string,
) => {
  if (customSearch) {
    return {
      pathname: `/flows/${flowId}`,
      search: customSearch,
    };
  }

  return {
    pathname: `/flows/${flowId}`,
    search: `${SEARCH_PARAMS.viewOnly}=${viewOnly}`,
  };
};

/**
 * Recursively collects the total number of flows in a folder and its subfolders.
 *
 * @param {FolderDto} folder - The folder to collect flows from.
 * @returns {number} The total number of flows.
 */
const collectNumberOfFlows = (folder: FolderDto): number => {
  let totalFlows = folder.numberOfFlows;

  if (folder.subfolders) {
    for (const subfolder of folder.subfolders) {
      totalFlows += collectNumberOfFlows(subfolder);
    }
  }

  return totalFlows;
};

/**
 * Maps a FolderDto to a FolderItem, including its subfolders and flows.
 *
 * @param {FolderDto} folder - The folder to map.
 * @returns {FolderItem} The mapped FolderItem.
 */
const mapFolderDtoToFolderItem = (folder: FolderDto): FolderItem => {
  const subfolderItems = folder.subfolders
    ? folder.subfolders.map(mapFolderDtoToFolderItem)
    : [];

  const flowItems = folder.flows
    ? folder.flows.map((flow) => ({
        id: flow.id,
        displayName: flow.displayName,
        type: 'item' as const,
        parentFolderId: folder.id,
      }))
    : [];

  return {
    id: folder.id,
    displayName: folder.displayName,
    type: 'folder',
    parentFolderId: folder.parentFolderId,
    itemCount: collectNumberOfFlows(folder),
    children: [...subfolderItems, ...flowItems],
  };
};

/**
 * Recursively traverses the folder tree to find the parent folder of a given flow.
 *
 * @param {FolderItem[]} folderItems - The array of folders to traverse.
 * @param {string} flowId - The ID of the flow to find.
 * @param {string} [folderId] - Optional folderId.
 * @returns {FolderItem | undefined} The parent folder containing the flow, or undefined if not found.
 */
const findSelectedFlowParentFolder = (
  folderItems: FolderItem[] | undefined,
  flowId: string,
  folderId?: string,
): FolderItem | undefined => {
  if (!folderItems) {
    return undefined;
  }

  for (const folder of folderItems) {
    if (
      folder.type === 'folder' &&
      (folder.id === folderId ||
        folder.children?.some(
          (flow) => flow.type === 'item' && flow.id === flowId,
        ))
    ) {
      return folder;
    }

    const parentFolder = findSelectedFlowParentFolder(
      folder.children,
      flowId,
      folderId,
    );
    if (parentFolder) {
      return parentFolder;
    }
  }
};

/**
 * Get all folder paths for all folders and subfolders
 *
 * @param {FolderItem} folderItems items - list of all root folders and subfolders
 * @param {string[]} [excludeFolderIds] The list of folder IDs to exclude.
 * @returns {Map<string, FolderItem[]>} An object containing id and path of all folders.
 */
const buildFolderHierarchy = (
  folderItems?: FolderItem[],
  excludeFolderIds: string[] | undefined = [],
) => {
  const foldersHierarchy: Map<string, FolderItem[]> = new Map();

  if (folderItems === undefined) {
    return foldersHierarchy;
  }

  folderItems.forEach((folderItem) => {
    if (folderItem.type === 'folder') {
      if (!excludeFolderIds.includes(folderItem.id)) {
        foldersHierarchy.set(folderItem.id, [folderItem]);
      }

      if (folderItem.children) {
        const subfoldersHierarchy = buildFolderHierarchy(
          folderItem.children,
          excludeFolderIds,
        );

        subfoldersHierarchy.forEach((value, key) => {
          if (!excludeFolderIds.includes(key)) {
            foldersHierarchy.set(key, [folderItem, ...value]);
          }
        });
      }
    }
  });

  return foldersHierarchy;
};

/**
 * Returns an array of folder items with their display names
 *
 * @param {Map<string, FolderItem[]>} foldersHierarchy - The folder hierarchy to get the display names from.
 * @param {string} [concatString=' > '] - The string to concatenate the display names with.
 * @returns {{id: string, displayName: string}[]} An array of folder items with their display names.
 */
const getFolderHierarchyDisplayNames = (
  foldersHierarchy: Map<string, FolderItem[]>,
  concatString = ' > ',
) =>
  [...foldersHierarchy].map(([folderId, values]) => ({
    id: folderId,
    displayName: values.map((folder) => folder.displayName).join(concatString),
  }));

/**
 * Filters the folder items based on the search term and returns the filtered folder items.
 * This uses a hybrid approach, having filtered search results for flows and filtering the rest client-side.
 * If a folder is matched, we show all items
 * If an item is matched, we show it and all the folder tree for the item
 *
 * @param {FolderItem[]} folderItems - The array of folders to filter.
 * @param {FlowsSearchState} flowsSearchState - The search state for the flows.
 * @returns {FolderItem[]} The filtered folder items.
 */
const getFilteredFolders = (
  folderItems: FolderItem[],
  flowsSearchState: FlowsSearchState,
) => {
  if (flowsSearchState.searchTerm === '') {
    return folderItems;
  }

  const searchedItemIds = new Set<string>(
    flowsSearchState.results.map((f) => f.id),
  );

  // only 100 flows are shown at a time in a folder, so if another flow is in the search results
  // but not in the folderItems dataset, then we should add it
  flowsSearchState.results.forEach((flow) => {
    const parentFolder = findSelectedFlowParentFolder(
      folderItems,
      flow.id,
      flow.folderId || UNCATEGORIZED_FOLDER_ID,
    );

    if (parentFolder) {
      const flowExists = parentFolder.children?.some(
        (child) => child.type === 'item' && child.id === flow.id,
      );

      if (!flowExists) {
        parentFolder.children = parentFolder.children || [];
        parentFolder.itemCount = undefined;
        parentFolder.children.push({
          id: flow.id,
          displayName: flow.version.displayName,
          type: 'item',
          parentFolderId: flow.folderId || UNCATEGORIZED_FOLDER_ID,
        });
      }
    }
  });

  const filterFolder = (folder: FolderItem): FolderItem | null => {
    if (
      folder.displayName
        .toLowerCase()
        .includes(flowsSearchState.searchTerm.toLowerCase())
    ) {
      const removeItemCount = (item: FolderItem): FolderItem => {
        if (item.type === 'folder') {
          return {
            ...item,
            itemCount: undefined,
            children: item.children?.map(removeItemCount),
          };
        }
        return item;
      };

      return removeItemCount(folder);
    }

    if (folder.type === 'folder' && folder.children) {
      const filteredChildren = folder.children
        .map((child) => {
          if (child.type === 'folder') {
            return filterFolder(child);
          }
          if (child.type === 'item' && searchedItemIds.has(child.id)) {
            return child;
          }
          return null;
        })
        .filter(Boolean) as FolderItem[];

      // return folder with filtered children
      if (filteredChildren.length > 0) {
        return {
          ...folder,
          itemCount: undefined,
          children: filteredChildren,
        };
      }

      return null;
    }

    return null;
  };

  const filteredFolders = folderItems
    .map(filterFolder)
    .filter(Boolean) as FolderItem[];

  return filteredFolders;
};

/**
 * Returns all folder ids in the folder hierarchy
 *
 * @param {FolderItem[]} folders - The array of folders to get the ids from.
 * @returns {Set<string>} The set of folder ids.
 */
const getAllFolderIds = (folders: FolderItem[]): Set<string> => {
  const allIds = new Set<string>();

  folders.forEach((f) => {
    allIds.add(f.id);
    getAllChildFolderItems(f).forEach((f) => {
      allIds.add(f.id);
    });
  });

  return allIds;
};

export {
  buildFolderHierarchy,
  collectNumberOfFlows,
  findSelectedFlowParentFolder,
  getAllChildFolderItems,
  getAllFolderIds,
  getFilteredFolders,
  getFlowLink,
  getFolderHierarchyDisplayNames,
  mapFolderDtoToFolderItem,
};
